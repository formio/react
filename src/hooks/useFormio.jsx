import React, { useEffect, useRef, useMemo } from 'react';
import { Formio } from '@formio/js';
import isEqual from 'lodash/isEqual';
import { EventEmitter } from '@formio/js';

const getDefaultEmitter = () => {
	return new EventEmitter({
		wildcard: false,
		maxListeners: 0,
	});
};

const createWebformInstance = (element, srcOrForm, options) => {
	// const { options: formOptions = {}, formioform, formReady } = options;
	const instance = new Formio.Form(element, srcOrForm);
	return instance.ready.then((formioInstance) => {
		// if (formReady) {
		// 	formReady(formioInstance);
		// }
		return formioInstance;
	});
};

const onAnyEvent = (event, options = {}, ...args) => {
	if (event.startsWith('formio.')) {
		const funcName = `on${event.charAt(7).toUpperCase()}${event.slice(8)}`;
		if (
			Object.prototype.hasOwnProperty.call(options, funcName) &&
			typeof options[funcName] === 'function'
		) {
			options[funcName](...args);
		}
	}
};

export const useFormio = (formSrcOrDefinition) => {
	const formInstance = useRef(null);
	const element = useRef(null);
	const promise = useRef(null);

	useEffect(() => () => {
		console.log('Cleanup called');
		return formInstance.current ? formInstance.current.destroy(true) : null;
	});

	useEffect(() => {
		console.log('Creating instance.');

		promise.current = createWebformInstance(
			element.current,
			formSrcOrDefinition,
		).then((instance) => {
			if (instance) {
				instance.src = formSrcOrDefinition;
				// instance.onAny((event, ...args) =>
				// 	onAnyEvent(event, options, ...args),
				// );
				formInstance.current = instance;
				return formInstance.current;
			}
		});
	}, [formSrcOrDefinition]);

	const Form = useMemo(
		() =>
			function FormComponent({ submission }) {
				console.log('first submission', submission);
				useEffect(() => {
					console.log(promise.current);
					if (promise.current) {
						promise.current.then((instance) => {
							if (instance && submission) {
								console.log(
									'mutating submission to',
									submission,
								);
								instance.submission = { ...submission };
							}
						});
					}
				}, [submission]);
				return <div ref={element} />;
			},
		[],
	);

	return {
		Form,
		formInstance: formInstance.current,
	};
};
