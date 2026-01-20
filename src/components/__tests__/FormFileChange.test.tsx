
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../Form';

const fileForm = {
    display: 'form' as const,
    components: [
        {
            label: 'Upload File',
            key: 'file',
            type: 'file',
            input: true,
            storage: 'base64',
        },
    ],
};

test('onChange should report modified=true when file is changed', async () => {
    const handleChange = jest.fn((value, flags, modified) => {
        // console.log('onChange called', { value, flags, modified });
    });

    let formInstance: any;
    render(<Form src={fileForm} onChange={handleChange} onFormReady={(instance) => formInstance = instance} />);

    await waitFor(() => {
        expect(screen.getByText('Upload File')).toBeInTheDocument();
        expect(formInstance).toBeDefined();
    });

    const fileComponent = formInstance.getComponent('file');
    const fileValue = [{
        name: 'test.png',
        size: 100,
        type: 'image/png',
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    }];

    // Trigger change. Currently reproduces modified=false.
    fileComponent.setValue(fileValue);

    await waitFor(() => expect(handleChange).toHaveBeenCalledTimes(1));
    const args = handleChange.mock.calls[0];
    console.log('File Change Args:', { modified: args[2] });

    // This should PASS after the fix
    expect(args[2]).toBe(true);
}, 10000);
