import { useState } from 'react';
import { Formio, EventEmitter } from '@formio/js';

export type UseFormioArgs = {
	baseUrl?: string;
	projectUrl?: string;
};

export const useFormio = ({ baseUrl, projectUrl }: UseFormioArgs) => {
	const [token, setToken] = useState(Formio.getToken() || null);
	const [isAuthenticated, setIsAuthenticated] = useState(!!token);

	// establish basic Formio configuration
	if (baseUrl) {
		Formio.setBaseUrl(baseUrl);
	}
	if (projectUrl) {
		Formio.setProjectUrl(projectUrl);
	}

	// TODO: this is due to a desync in event emitters between @formio/js and @formio/core; once fixed, we shouldn't need it
	Formio.events = new EventEmitter({
		wildcard: false,
		maxListeners: 0,
	});

	// listen for user events for authentication
	Formio.events.on('formio.user', async (user: unknown) => {
		if (user) {
			setToken(Formio.getToken());
			setIsAuthenticated(true);
		} else if (isAuthenticated) {
			await Formio.logout();
			setToken(null);
			setIsAuthenticated(false);
		}
	});

	// handle a stale token
	if (isAuthenticated) {
		Formio.currentUser().then((user: any) => {
			if (!user) {
				setToken(null);
				setIsAuthenticated(false);
			}
		});
	}

	const logout = async () => {
		await Formio.logout();
		setToken(null);
		setIsAuthenticated(false);
	};

	return {
		Formio,
		baseUrl: Formio.baseUrl,
		projectUrl: Formio.projectUrl,
		logout,
		token,
		isAuthenticated,
	};
};
