import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Formio } from '@formio/js';

import { Form } from '../Form';
import { FormioProvider } from '../../contexts/FormioContext';

const simpleForm = {
	display: 'form' as const,
	components: [
		{
			label: 'First Name',
			key: 'firstName',
			type: 'textfield',
			input: true,
		},
	],
};

describe('customFetch prop', () => {
	let originalFetch: typeof Formio.fetch;

	beforeEach(() => {
		originalFetch = Formio.fetch;
	});

	afterEach(() => {
		// Always restore the original fetch after each test
		Formio.fetch = originalFetch;
		cleanup();
	});

	test('applies customFetch to Formio.fetch when provided as a prop', async () => {
		const mockFetch = jest.fn(async () => new Response());

		await new Promise<void>((resolve) => {
			render(
				<Form
					src={simpleForm}
					customFetch={mockFetch}
					onFormReady={() => {
						expect(Formio.fetch).toBe(mockFetch);
						resolve();
					}}
				/>,
			);
		});
	});

	test('restores Formio.fetch to original value after unmount', async () => {
		const mockFetch = jest.fn(async () => new Response());

		const { unmount } = render(
			<Form src={simpleForm} customFetch={mockFetch} />,
		);

		// Wait for the form to be created
		await new Promise((resolve) => setTimeout(resolve, 500));

		unmount();

		// After unmount, Formio.fetch should be restored
		expect(Formio.fetch).toBe(originalFetch);
	});

	test('does not modify Formio.fetch when customFetch is not provided', async () => {
		await new Promise<void>((resolve) => {
			render(
				<Form
					src={simpleForm}
					onFormReady={() => {
						expect(Formio.fetch).toBe(originalFetch);
						resolve();
					}}
				/>,
			);
		});
	});

	test('uses customFetch from FormioProvider context', async () => {
		const mockFetch = jest.fn(async () => new Response());

		await new Promise<void>((resolve) => {
			render(
				<FormioProvider customFetch={mockFetch}>
					<Form
						src={simpleForm}
						onFormReady={() => {
							expect(Formio.fetch).toBe(mockFetch);
							resolve();
						}}
					/>
				</FormioProvider>,
			);
		});
	});

	test('Form-level customFetch overrides FormioProvider-level customFetch', async () => {
		const providerFetch = jest.fn(async () => new Response());
		const formFetch = jest.fn(async () => new Response());

		await new Promise<void>((resolve) => {
			render(
				<FormioProvider customFetch={providerFetch}>
					<Form
						src={simpleForm}
						customFetch={formFetch}
						onFormReady={() => {
							expect(Formio.fetch).toBe(formFetch);
							expect(Formio.fetch).not.toBe(providerFetch);
							resolve();
						}}
					/>
				</FormioProvider>,
			);
		});
	});
});
