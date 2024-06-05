import { createContext, useState, useEffect } from 'react';
import { Formio } from '@formio/js';

type BaseConfigurationArgs = {
	baseUrl?: string;
	projectUrl?: string;
};
const useBaseConfiguration = ({
	baseUrl,
	projectUrl,
}: BaseConfigurationArgs) => {
	// establish basic Formio configuration
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
	};
};

const useAuthentication = () => {
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
	}, [isAuthenticated]);

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
}: { children: React.ReactNode } & BaseConfigurationArgs) {
	const formio = {
		...useBaseConfiguration({ baseUrl, projectUrl }),
		...useAuthentication(),
	};
	return (
		<FormioContext.Provider value={formio}>
			{children}
		</FormioContext.Provider>
	);
}
