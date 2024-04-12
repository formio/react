import { render, screen } from '@testing-library/react';
import { debug } from 'jest-preview';
import '@testing-library/jest-dom';

import Form from '../Form';

const simpleForm = {
	display: 'form',
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
	],
};

test('loads and displays a simple form', async () => {
	render(<Form src={simpleForm} />);
	debug();
	expect(screen.getByText('First Name')).toBeInTheDocument();
	expect(screen.getByText('Last Name')).toBeInTheDocument();
	expect(await screen.findByRole('button')).toBeDisabled();
});
