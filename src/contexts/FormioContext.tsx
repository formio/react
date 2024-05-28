import { createContext } from 'react';

import { UseFormioArgs, useFormio } from '../hooks/useFormio';

export const FormioContext = createContext<ReturnType<typeof useFormio> | null>(
	null,
);

export function FormioProvider({
	children,
	baseUrl,
	projectUrl,
}: { children: React.ReactNode } & UseFormioArgs) {
	const formio = useFormio({ baseUrl, projectUrl });
	return (
		<FormioContext.Provider value={formio}>
			{children}
		</FormioContext.Provider>
	);
}
