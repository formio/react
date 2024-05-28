import { useContext } from 'react';
import { FormioContext } from '../contexts/FormioContext';

export function useFormioContext() {
	const context = useContext(FormioContext);

	if (!context) {
		throw new Error(
			'useFormioContext must be used within a FormioProvider component.',
		);
	}
	return context;
}
