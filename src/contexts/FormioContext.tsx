import { createContext, useState, useEffect } from 'react';
import { Formio as ImportedFormio } from '@formio/js';

/**
 * A custom fetch function type that matches the native fetch API signature.
 * Can be passed to `<FormioProvider>` or `<Form>` to override the default
 * fetch behavior used by Form.io for all HTTP requests.
 */
export type FormioCustomFetch = (
	input: RequestInfo | URL,
	init?: RequestInit,
) => Promise<Response>;

type BaseConfigurationArgs = {
	baseUrl?: string;
	projectUrl?: string;
	Formio?: typeof ImportedFormio;
	customFetch?: FormioCustomFetch;
};

const useBaseConfiguration = ({
	baseUrl,
	projectUrl,
	Formio,
	customFetch,
}: BaseConfigurationArgs) => {
	if (!Formio) {
		if (baseUrl) {
			ImportedFormio.setBaseUrl(baseUrl);
		}
		if (projectUrl) {
			ImportedFormio.setProjectUrl(projectUrl);
		}
		return {
			Formio: ImportedFormio,
			baseUrl: ImportedFormio.baseUrl,
			projectUrl: ImportedFormio.projectUrl,
			customFetch,
		};
	}

	if (baseUrl) {
		Formio.setBaseUrl(baseUrl);
	}
	if (projectUrl) {
		Formio.setProjectUrl(projectUrl);
	}

	return {
		Formio,
		baseUrl: Formio.baseUrl,
		projectUrl: Formio.projectUrl,
		customFetch,
	};
};

const useAuthentication = ({ Formio }: { Formio: typeof ImportedFormio }) => {
	const [token, setToken] = useState(Formio.getToken() || null);
	const [isAuthenticated, setIsAuthenticated] = useState(!!token);

	useEffect(() => {
		const handleUserEvent = async (user: unknown) => {
			if (user) {
				setToken(Formio.getToken());
				setIsAuthenticated(true);
			} else if (isAuthenticated) {
				await Formio.logout();
				setToken(null);
				setIsAuthenticated(false);
			}
		};

		const handleStaleToken = async () => {
			if (isAuthenticated) {
				const user = await Formio.currentUser();
				if (!user) {
					setToken(null);
					setIsAuthenticated(false);
				}
			}
		};

		Formio.events.on('formio.user', handleUserEvent);
		handleStaleToken();

		return () => {
			Formio.events.off('formio.user', handleUserEvent);
		};
	}, [isAuthenticated, Formio]);

	const logout = async () => {
		await Formio.logout();
		setToken(null);
		setIsAuthenticated(false);
	};

	return { token, setToken, isAuthenticated, logout };
};

export const FormioContext = createContext<
	| (ReturnType<typeof useBaseConfiguration> &
			ReturnType<typeof useAuthentication>)
	| null
>(null);

export function FormioProvider({
	children,
	baseUrl,
	projectUrl,
	Formio,
	customFetch,
}: { children: React.ReactNode } & BaseConfigurationArgs) {
	const baseConfig = useBaseConfiguration({ baseUrl, projectUrl, Formio, customFetch });
	const auth = useAuthentication({ Formio: baseConfig.Formio });
	const formio = { ...baseConfig, ...auth };
	return (
		<FormioContext.Provider value={formio}>
			{children}
		</FormioContext.Provider>
	);
}
