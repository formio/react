import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useRef, useState } from 'react';
import { EventEmitter, Form as FormClass, Webform, Formio } from '@formio/js';
import { Component, Form as FormType } from '@formio/core';
export type JSON =
	| string
	| number
	| boolean
	| null
	| undefined
	| JSON[]
	| { [key: string]: JSON };
type FormSource = string | FormType;
type FormOptions = FormClass['options'];
interface FormConstructor {
	new (
		element: HTMLElement,
		formSource: FormSource,
		options: FormOptions,
	): FormClass;
}
type EventError =
	| string
	| Error
	| Error[]
	| { message: string }
	| { message: string }[];
type FormProps = {
	src?: FormSource;
	url?: string;
	form?: FormType;
	submission?: { data: JSON; metadata?: JSON; state?: string } & {
		[key: string]: JSON;
	};
	// TODO: once events is typed correctly in @formio/js options, we can remove this override
	options?: FormOptions & { events?: EventEmitter };
	formioform?: FormConstructor;
	FormClass?: FormConstructor;
	formReady?: (instance: Webform) => void;
	onFormReady?: (instance: Webform) => void;
	onPrevPage?: (page: number, submission: JSON) => void;
	onNextPage?: (page: number, submission: JSON) => void;
	onCancelSubmit?: () => void;
	onCancelComponent?: (component: Component) => void;
	onChange?: (value: any, flags: any, modified: boolean) => void;
	onCustomEvent?: (event: {
		type: string;
		component: Component;
		data: JSON;
		event?: Event;
	}) => void;
	onComponentChange?: (changed: {
		instance: Webform;
		component: Component;
		value: any;
		flags: any;
	}) => void;
	onSubmit?: (submission: JSON, saved?: boolean) => void;
	onSubmitDone?: (submission: JSON) => void;
	onSubmitError?: (error: EventError) => void;
	onFormLoad?: (form: JSON) => void;
	onError?: (error: EventError | false) => void;
	onRender?: (param: any) => void;
	onAttach?: (param: any) => void;
	onBuild?: (param: any) => void;
	onFocus?: (instance: Webform) => void;
	onBlur?: (instance: Webform) => void;
	onInitialized?: () => void;
	otherEvents?: {
		[event: string]: (...args: any[]) => void;
	};
};

const getDefaultEmitter = () => {
	return (
		Formio.events ||
		new EventEmitter({
			wildcard: false,
			maxListeners: 0,
		})
	);
};

const onAnyEvent = (
	handlers: Omit<
		FormProps,
		| 'src'
		| 'url'
		| 'form'
		| 'submission'
		| 'options'
		| 'formReady'
		| 'formioform'
		| 'Formio'
	>,
	...args: [string, ...any[]]
) => {
	const event = args[0];
	if (event.startsWith('formio.')) {
		const funcName = `on${event.charAt(7).toUpperCase()}${event.slice(8)}`;
		switch (funcName) {
			case 'onPrevPage':
				if (handlers.onPrevPage) handlers.onPrevPage(args[1], args[2]);
				break;
			case 'onNextPage':
				if (handlers.onNextPage) handlers.onNextPage(args[1], args[2]);
				break;
			case 'onCancelSubmit':
				if (handlers.onCancelSubmit) handlers.onCancelSubmit();
				break;
			case 'onCancelComponent':
				if (handlers.onCancelComponent)
					handlers.onCancelComponent(args[1]);
				break;
			case 'onChange':
				if (handlers.onChange)
					handlers.onChange(args[1], args[2], args[3]);
				break;
			case 'onCustomEvent':
				if (handlers.onCustomEvent) handlers.onCustomEvent(args[1]);
				break;
			case 'onComponentChange':
				if (handlers.onComponentChange)
					handlers.onComponentChange(args[1]);
				break;
			case 'onSubmit':
				if (handlers.onSubmit) handlers.onSubmit(args[1], args[2]);
				break;
			case 'onSubmitDone':
				if (handlers.onSubmitDone) handlers.onSubmitDone(args[1]);
				break;
			case 'onSubmitError':
				if (handlers.onSubmitError) handlers.onSubmitError(args[1]);
				break;
			case 'onFormLoad':
				if (handlers.onFormLoad) handlers.onFormLoad(args[1]);
				break;
			case 'onError':
				if (handlers.onError) handlers.onError(args[1]);
				break;
			case 'onRender':
				if (handlers.onRender) handlers.onRender(args[1]);
				break;
			case 'onAttach':
				if (handlers.onAttach) handlers.onAttach(args[1]);
				break;
			case 'onBuild':
				if (handlers.onBuild) handlers.onBuild(args[1]);
				break;
			case 'onFocus':
				if (handlers.onFocus) handlers.onFocus(args[1]);
				break;
			case 'onBlur':
				if (handlers.onBlur) handlers.onBlur(args[1]);
				break;
			case 'onInitialized':
				if (handlers.onInitialized) handlers.onInitialized();
				break;
			default:
				break;
		}
	}
	if (handlers.otherEvents && handlers.otherEvents[event]) {
		handlers.otherEvents[event](...args.slice(1));
	}
};

const createWebformInstance = async (
	FormConstructor: FormConstructor | undefined,
	formSource: FormSource,
	element: HTMLDivElement,
	options: FormProps['options'] = {},
) => {
	if (!options?.events) {
		options.events = getDefaultEmitter();
	}
	const promise = FormConstructor
		? new FormConstructor(element, formSource, options)
		: new FormClass(element, formSource, options);
	const instance = await promise.ready;
	return instance;
};

// Define effective props (aka I want to rename these props but also maintain backwards compatibility)
const getEffectiveProps = (props: FormProps) => {
	const { FormClass, formioform, form, src, formReady, onFormReady } = props;
	const formConstructor = FormClass !== undefined ? FormClass : formioform;

	const formSource = form !== undefined ? form : src;

	const formReadyCallback =
		onFormReady !== undefined ? onFormReady : formReady;

	return { formConstructor, formSource, formReadyCallback };
};

export const Form = (props: FormProps) => {
	console.log('form component render');
	const [formInstance, setFormInstance] = useState<Webform | null>(null);
	const renderElement = useRef<HTMLDivElement | null>(null);
	const prevFormDefinition = useRef<FormType | null>(null);

	const { formConstructor, formSource, formReadyCallback } =
		getEffectiveProps(props);
	const {
		src,
		form,
		submission,
		url,
		options,
		formioform,
		formReady,
		FormClass,
		...handlers
	} = props;

	useEffect(() => () => formInstance?.destroy(), [formInstance]);

	useEffect(() => {
		const createInstance = async () => {
			if (renderElement.current === null) {
				console.warn('Form element not found');
				return;
			}

			if (typeof formSource === 'undefined') {
				console.warn('Form source not found');
				return;
			}

			if (typeof formSource === 'object') {
				// If formSource is an object and hasn't changed, return early
				if (isEqual(formSource, prevFormDefinition.current)) {
					return;
				}

				prevFormDefinition.current = cloneDeep(formSource);
			}

			const instance = await createWebformInstance(
				formConstructor,
				formSource,
				renderElement.current,
				options,
			);

			if (instance) {
				if (typeof formSource === 'string') {
					instance.src = formSource;
				} else if (typeof formSource === 'object') {
					instance.form = formSource;

					if (url) {
						instance.url = url;
					}
				}

				if (formReadyCallback) {
					formReadyCallback(instance);
				}

				setFormInstance(instance);
			}
		};

		createInstance();
	}, [formConstructor, formReadyCallback, formSource, options, url]);

	useEffect(() => {
		if (formInstance && Object.keys(handlers).length > 0) {
			formInstance.onAny((...args: [string, ...any[]]) =>
				onAnyEvent(handlers, ...args),
			);
		}
		return () => {
			formInstance?.offAny((...args: [string, ...any[]]) => {
				onAnyEvent(handlers, ...args);
			});
		};
	}, [formInstance, handlers]);

	useEffect(() => {
		if (formInstance && submission) {
			formInstance.submission = cloneDeep(submission);
		}
	}, [formInstance, submission]);

	return <div ref={renderElement} />;
};
