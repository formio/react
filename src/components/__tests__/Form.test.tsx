import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Form } from '../Form';

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
