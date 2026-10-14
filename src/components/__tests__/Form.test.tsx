import { act, render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { EventEmitter, Webform } from '@formio/js';

import { Form, FormOptions, FormProps } from '../Form';

const simpleForm = {
	display: 'form' as const,
	components: [
		{
			label: 'First Name',
			key: 'firstName',
			type: 'textfield',
			input: true,
		},
		{
			label: 'Last Name',
			key: 'lastName',
			type: 'textfield',
			input: true,
			validate: {
				required: true,
			},
		},
		{
			label: 'Submit',
			type: 'button',
			key: 'submit',
			input: true,
			disableOnInvalid: true,
		},
	],
};

test('loads and displays a simple form', async () => {
	const executeTests = async () => {
		expect(screen.getByText('First Name')).toBeInTheDocument();
		expect(screen.getByText('Last Name')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
		expect(await screen.findByRole('button')).toBeDisabled();
	};
	render(<Form src={simpleForm} onFormReady={executeTests} />);
});

test('keeps exactly one `any` listener and detaches it on unmount', async () => {
	// The emitter is what leaks: `createWebformInstance` stores it on the
	// caller's `options` object, so it outlives any one form instance.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const onChange = jest.fn();

	const { rerender, unmount } = render(
		<Form src={simpleForm} options={options} onChange={onChange} />,
	);
	await waitFor(() => expect(events.listenerCount('any')).toBe(1));

	// A new handler identity must not churn or duplicate the subscription.
	rerender(
		<Form src={simpleForm} options={options} onChange={() => onChange()} />,
	);
	expect(events.listenerCount('any')).toBe(1);

	unmount();
	await waitFor(() => expect(events.listenerCount('any')).toBe(0));
});

// A second, structurally different form, so swapping `src` genuinely rebuilds
// the instance instead of tripping the deep-equal early return in the create
// effect.
const otherForm = {
	display: 'form' as const,
	components: [
		{
			label: 'Email',
			key: 'email',
			type: 'email',
			input: true,
		},
	],
};

// `Element.d.ts` declares `events` as non-optional, but `destroy(true)` deletes
// it, so the type cannot express the state this asserts on. Read it through a
// view that admits `undefined`. (Same mismatch is why `events?.offAny(...)` in
// `Form.tsx` is load-bearing rather than dead defensiveness.)
const eventsOf = (instance: Webform) =>
	(instance as unknown as { events?: EventEmitter }).events;

// `Webform['submission']` is typed as a bare `object`; narrow it for assertions.
const submissionOf = (instance: Webform) =>
	instance.submission as { data: Record<string, unknown> };

// `createWebformInstance` only ever does `new FormClass(element, source, options)`
// and awaits `.ready`, so a stand-in needs nothing more than that. Deferring the
// resolution is what lets a test place two creates in one React batch, or hand
// back an instance that is already torn down.
type FakeInstance = {
	events?: EventEmitter;
	form?: unknown;
	src?: unknown;
	destroy: jest.Mock;
	onAny: jest.Mock;
	offAny: jest.Mock;
};

const deferredFormClass = () => {
	const created: FakeInstance[] = [];
	const pending: Array<{
		resolve: (value: unknown) => void;
		instance: FakeInstance;
	}> = [];

	class DeferredForm {
		ready: Promise<unknown>;

		constructor(
			_element: HTMLElement,
			_source: unknown,
			options: FormOptions,
		) {
			// Route through `instance.events`, never a captured emitter: `Element`
			// reads `this.events` on every call and short-circuits once
			// `teardown()` has deleted it, and a fake that stays subscribed after
			// destroy would hide exactly the bug these tests exist for.
			const instance: FakeInstance = {
				events: options.events,
				destroy: jest.fn(() => delete instance.events),
				onAny: jest.fn((cb: (...args: unknown[]) => void) =>
					instance.events?.onAny(cb),
				),
				offAny: jest.fn((cb: (...args: unknown[]) => void) =>
					instance.events?.offAny(cb),
				),
			};
			created.push(instance);
			this.ready = new Promise((resolve) =>
				pending.push({ resolve, instance }),
			);
		}
	}

	return {
		FormClass: DeferredForm as unknown as FormProps['FormClass'],
		created,
		// Settle every outstanding create at once, so their continuations land in
		// a single React batch. `as` rewrites what each one resolves to.
		settle: (as?: (instance: FakeInstance) => unknown) =>
			pending
				.splice(0)
				.forEach(({ resolve, instance }) =>
					resolve(as ? as(instance) : instance),
				),
	};
};

test('rewires handlers and submission onto the instance a rerender builds', async () => {
	// FIO-9589 (formio/react#595): the handler and submission effects key on
	// `formInstance`. They used to key on an `instanceIsReady` boolean that only
	// ever went true, so the second instance a rerender built came up with no
	// handlers and no submission attached. Each instance gets its own emitter
	// here (no `options` passed), so firing through the new instance proves the
	// new instance is the one that is wired.
	const instances: Webform[] = [];
	// Stable identity: `onFormReady` is a create-effect dependency, and a fresh
	// closure each render would rebuild the form on every render.
	const captureInstance = (instance: Webform) => {
		instances.push(instance);
	};
	const onChange = jest.fn();

	const { rerender } = render(
		<Form
			src={simpleForm}
			submission={{ data: { firstName: 'Joe' } }}
			onChange={onChange}
			onFormReady={captureInstance}
		/>,
	);
	await waitFor(() => expect(instances).toHaveLength(1));

	rerender(
		<Form
			src={otherForm}
			submission={{ data: { email: 'joe@example.com' } }}
			onChange={onChange}
			onFormReady={captureInstance}
		/>,
	);
	await waitFor(() => expect(instances).toHaveLength(2));

	await waitFor(() =>
		expect(submissionOf(instances[1]).data).toMatchObject({
			email: 'joe@example.com',
		}),
	);

	onChange.mockClear();
	instances[1].emit('change', { data: { email: 'joe@example.com' } });
	expect(onChange).toHaveBeenCalledTimes(1);
});

test('destroys the instance a rerender replaces', async () => {
	// FIO-9944 (formio/react#610): the replacement is set through a state updater
	// that destroys the instance it displaces, so a rebuilt form cannot strand
	// the old one. `destroy(true)` runs `teardown()`, which deletes `events` --
	// that deletion is the observable proof it ran.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const instances: Webform[] = [];
	const captureInstance = (instance: Webform) => {
		instances.push(instance);
	};

	const { rerender } = render(
		<Form
			src={simpleForm}
			options={options}
			onFormReady={captureInstance}
		/>,
	);
	await waitFor(() => expect(instances).toHaveLength(1));

	rerender(
		<Form
			src={otherForm}
			options={options}
			onFormReady={captureInstance}
		/>,
	);
	await waitFor(() => expect(instances).toHaveLength(2));

	expect(instances[0]).not.toBe(instances[1]);
	await waitFor(() => expect(eventsOf(instances[0])).toBeUndefined());
	// The displaced instance took its subscription with it: the shared emitter is
	// left holding exactly the replacement's listener.
	await waitFor(() => expect(events.listenerCount('any')).toBe(1));
});

test('destroys an instance whose promise resolves after unmount', async () => {
	// FIO-9944 / GOTCHA(G-RC01): `createWebformInstance` is awaited, so the
	// instance can arrive after React has unmounted the component. Nothing else
	// can reach it -- `formInstance` state was never set, so the destroy effect
	// has nothing to clean up -- and without the `isMounted` guard it is
	// stranded, fully rendered, for the life of the page.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const destroy = jest.spyOn(Webform.prototype, 'destroy');

	try {
		const { unmount } = render(<Form src={simpleForm} options={options} />);
		unmount();

		await waitFor(() => expect(destroy).toHaveBeenCalledWith(true));
		expect(events.listenerCount('any')).toBe(0);
	} finally {
		destroy.mockRestore();
	}
});

test('dispatches to the latest handler without rebuilding the subscription', async () => {
	// The handlers are read through a ref, so a new handler identity must reach
	// the existing listener rather than tear it down and resubscribe.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const instances: Webform[] = [];
	const captureInstance = (instance: Webform) => {
		instances.push(instance);
	};
	const first = jest.fn();
	const second = jest.fn();

	const { rerender } = render(
		<Form
			src={simpleForm}
			options={options}
			onChange={first}
			onFormReady={captureInstance}
		/>,
	);
	await waitFor(() => expect(instances).toHaveLength(1));
	const subscription = events.listeners('any')[0];

	rerender(
		<Form
			src={simpleForm}
			options={options}
			onChange={second}
			onFormReady={captureInstance}
		/>,
	);

	expect(instances).toHaveLength(1);
	expect(events.listenerCount('any')).toBe(1);
	// Identity, not just count: unsubscribing and resubscribing within one commit
	// also leaves exactly one listener and also dispatches to the latest handler,
	// so a count alone cannot tell the two apart.
	expect(events.listeners('any')[0]).toBe(subscription);

	first.mockClear();
	second.mockClear();
	instances[0].emit('change', { data: {} });
	expect(second).toHaveBeenCalledTimes(1);
	expect(first).not.toHaveBeenCalled();
});

test('destroys an instance that is superseded before it ever commits', async () => {
	// FIO-9944 (formio/react#610), the case the destroy effect cannot catch. Two
	// creates can resolve in one React batch; React then commits only the last,
	// so the destroy effect -- which keys on the COMMITTED `formInstance` -- never
	// sees the first one and it is stranded. The state updater destroys whatever
	// it displaces, committed or not. Resolving both `ready` promises by hand is
	// what makes the batch deterministic rather than a timing race.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const { FormClass, created, settle } = deferredFormClass();

	const { rerender } = render(
		<Form src={simpleForm} options={options} FormClass={FormClass} />,
	);
	rerender(<Form src={otherForm} options={options} FormClass={FormClass} />);
	expect(created).toHaveLength(2);

	// Both continuations land before React re-renders, so both instances are set
	// in a single batch and only the second one is ever committed.
	await act(async () => settle());

	expect(created[0].destroy).toHaveBeenCalledWith(true);
	expect(created[1].destroy).not.toHaveBeenCalled();
});

// --- error and edge paths -------------------------------------------------
// Everything above exercises a form that builds. These cover the paths where it
// does not, or where the instance the effects are handed is not the healthy
// object they expect. The subscription must come out of each with the emitter
// holding exactly the listeners that belong to a live, mounted form.

test('leaves the previous instance subscribed when a rebuild produces nothing', async () => {
	// `createWebformInstance` resolving falsy is the "form failed to build" path:
	// a bad `src`, a constructor that bails. `setFormInstance` is never reached,
	// so the committed instance stays committed -- and its subscription has to
	// survive intact, because that form is still the one on screen.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const { FormClass, created, settle } = deferredFormClass();
	const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

	try {
		const { rerender } = render(
			<Form src={simpleForm} options={options} FormClass={FormClass} />,
		);
		await act(async () => settle());
		await waitFor(() => expect(events.listenerCount('any')).toBe(1));

		rerender(
			<Form src={otherForm} options={options} FormClass={FormClass} />,
		);
		await act(async () => settle(() => null));

		expect(created).toHaveLength(2);
		expect(warn).toHaveBeenCalledWith('Failed to create form instance');
		// The surviving instance keeps its listener, and the stillborn one adds none.
		expect(events.listenerCount('any')).toBe(1);
		expect(created[0].destroy).not.toHaveBeenCalled();
		expect(created[0].offAny).not.toHaveBeenCalled();
	} finally {
		warn.mockRestore();
	}
});

test('does not subscribe to an instance that arrives already torn down', async () => {
	// The subscription effect reads `formInstance.events`, and `destroy(true)`
	// deletes it. An instance can reach the effect in that state, so both the
	// subscribe and the cleanup have to tolerate a missing emitter rather than
	// throw on the way through.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const { FormClass, created, settle } = deferredFormClass();

	const { unmount } = render(
		<Form
			src={simpleForm}
			options={options}
			onChange={jest.fn()}
			FormClass={FormClass}
		/>,
	);
	await act(async () =>
		settle((instance) => {
			delete instance.events;
			return instance;
		}),
	);

	expect(created).toHaveLength(1);
	expect(events.listenerCount('any')).toBe(0);
	expect(() => unmount()).not.toThrow();
	expect(events.listenerCount('any')).toBe(0);
});

test('leaves a sibling form subscribed when one of them unmounts', async () => {
	// Two forms handed the same `options` share one emitter, so the cleanup has
	// to remove the unmounting form's listener and only that one. Removing the
	// wrong listener -- or, before FIO-12286, none at all -- is invisible until
	// the surviving form stops receiving events or starts double-firing.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const instances: Webform[] = [];
	const captureInstance = (instance: Webform) => {
		instances.push(instance);
	};
	const closing = jest.fn();
	const staying = jest.fn();

	const Pair = ({ showClosing }: { showClosing: boolean }) => (
		<>
			{showClosing && (
				<Form
					src={simpleForm}
					options={options}
					onChange={closing}
					onFormReady={captureInstance}
				/>
			)}
			<Form
				src={otherForm}
				options={options}
				onChange={staying}
				onFormReady={captureInstance}
			/>
		</>
	);

	const { rerender } = render(<Pair showClosing={true} />);
	await waitFor(() => expect(events.listenerCount('any')).toBe(2));

	rerender(<Pair showClosing={false} />);
	await waitFor(() => expect(events.listenerCount('any')).toBe(1));

	closing.mockClear();
	staying.mockClear();
	events.emit('formio.change', { data: {} });
	expect(staying).toHaveBeenCalledTimes(1);
	expect(closing).not.toHaveBeenCalled();
});

test('returns the shared emitter to zero listeners across mount/unmount churn', async () => {
	// The reported symptom was a count that climbed 1 -> 2 -> 3 over a session as
	// forms came and went against one long-lived emitter. One cycle can pass on a
	// cleanup that only half works; a run of them cannot.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };
	const onChange = jest.fn();

	for (let cycle = 0; cycle < 5; cycle++) {
		const { unmount } = render(
			<Form src={simpleForm} options={options} onChange={onChange} />,
		);
		await waitFor(() => expect(events.listenerCount('any')).toBe(1));
		unmount();
		await waitFor(() => expect(events.listenerCount('any')).toBe(0));
	}
});

test('adds no listener when the component unmounts mid-create, repeatedly', async () => {
	// The unmount race, run in a loop against one emitter: each aborted create is
	// destroyed by the `isMounted` guard before it can subscribe, so nothing
	// accumulates even when no form ever finishes building.
	const events = new EventEmitter({ wildcard: false, maxListeners: 0 });
	const options = { events };

	for (let cycle = 0; cycle < 5; cycle++) {
		const { unmount } = render(
			<Form src={simpleForm} options={options} onChange={jest.fn()} />,
		);
		unmount();
	}

	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 50));
	});
	expect(events.listenerCount('any')).toBe(0);
});
