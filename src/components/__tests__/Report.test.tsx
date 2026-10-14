import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventEmitter, Formio } from '@formio/js';

type ReportOptions = { events?: EventEmitter };

// `Formio.Report` ships in the reporting module, which this package does not
// depend on, and `Report.jsx` captures it at module load. The stand-in mirrors
// the two things the component relies on: `Form` writes its emitter onto the
// caller's `options` (`Form.js`, `this.options.events = this.events`), so the
// emitter outlives any one instance, and `ready` resolves to the INNER form,
// not the wrapper the `any` listener is attached to.
class FakeReport {
	events?: EventEmitter;
	ready: Promise<{ destroy: jest.Mock; form?: unknown }>;

	constructor(
		_element: HTMLElement,
		_srcOrReport: unknown,
		options: ReportOptions,
	) {
		this.events =
			options.events ||
			new EventEmitter({ wildcard: false, maxListeners: 0 });
		options.events = this.events;
		this.ready = Promise.resolve({ destroy: jest.fn() });
	}

	onAny(cb: (...args: unknown[]) => void) {
		return this.events?.onAny(cb);
	}

	offAny(cb: (...args: unknown[]) => void) {
		return this.events?.offAny(cb);
	}
}

(Formio as unknown as { Report: unknown }).Report = FakeReport;

const { Report } = jest.requireActual<{
	Report: (props: Record<string, unknown>) => JSX.Element;
}>('../Report');

const newEmitter = () => new EventEmitter({ wildcard: false, maxListeners: 0 });

test('detaches the report `any` listener on unmount', async () => {
	const events = newEmitter();
	const options = { events };

	const { unmount } = render(
		<Report src="https://example.com/report" options={options} />,
	);
	await waitFor(() => expect(events.listenerCount('any')).toBe(1));

	unmount();
	expect(events.listenerCount('any')).toBe(0);
});

test('keeps exactly one `any` listener when the report is rebuilt', async () => {
	const events = newEmitter();
	const options = { events };

	const { rerender } = render(
		<Report report={{ title: 'first' }} options={options} />,
	);
	await waitFor(() => expect(events.listenerCount('any')).toBe(1));

	rerender(<Report report={{ title: 'second' }} options={options} />);
	await waitFor(() => expect(events.listenerCount('any')).toBe(1));
});

test('dispatches to the latest handler props without a rebuild', async () => {
	const events = newEmitter();
	const options = { events };
	const first = jest.fn();
	const second = jest.fn();

	const { rerender } = render(
		<Report
			src="https://example.com/report"
			options={options}
			onRowClick={first}
		/>,
	);
	await waitFor(() => expect(events.listenerCount('any')).toBe(1));
	const subscription = events.listeners('any')[0];

	rerender(
		<Report
			src="https://example.com/report"
			options={options}
			onRowClick={second}
		/>,
	);

	// Identity, not just count: an unsubscribe/resubscribe would also dispatch to
	// the latest props, so a count alone cannot tell the two apart.
	expect(events.listeners('any')[0]).toBe(subscription);

	events.emit('formio.rowClick', { row: 1 });
	expect(second).toHaveBeenCalledWith({ row: 1 });
	expect(first).not.toHaveBeenCalled();
});
