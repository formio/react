import 'jest-canvas-mock';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Form } from '../Form';

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

globalThis.ResizeObserver = ResizeObserver;

const signatureForm = {
	display: 'form' as const,
	components: [
		{
			label: 'Signature',
			key: 'signature',
			type: 'signature',
			input: true,
		},
	],
};

test('signature change is marked as modified', async () => {
	let modified: boolean | undefined;

	const formReady = new Promise<any>((resolve) => {
		render(
			<Form
				src={signatureForm}
				onChange={(_value, _flags, isModified) => {
					modified = isModified;
				}}
				onFormReady={(form) => {
					resolve(form);
				}}
			/>,
		);
	});

	const form = await formReady;
	const signature = form.components[0];

	signature.signaturePad.toDataURL = jest.fn(
		() => 'data:image/png;base64,test',
	);

	signature.signaturePad.dispatchEvent(
		new CustomEvent('endStroke'),
	);

	expect(
		document.querySelector('.signature-pad'),
	).toBeInTheDocument();

	await new Promise((resolve) => setTimeout(resolve, 1000));

	expect(modified).toBe(true);
});
