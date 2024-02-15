import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Formio, EventEmitter, Form as FormClass } from '@formio/js';
import { Component } from '@formio/core';

type FormInstance = FormClass & { submission: { data: JSON } };
type FormOptions = {
	readOnly?: boolean;
	events: EventEmitter;
};
interface FormConstructor {
	new (...args: any[]): FormInstance;
}
type EventError =
	| string
	| Error
	| Error[]
	| { message: string }
	| { message: string }[];
type JSON = string | number | boolean | null | JSON[] | { [key: string]: JSON };
type FormSource = string | JSON;
type FormProps = {
	src?: FormSource;
	url?: string;
	form?: JSON;
	submission?: { data: JSON };
	// TODO: once events is typed correctly in @formio/js options, we can remove this override
	options?: FormOptions & { events?: EventEmitter };
	formReady?: (instance: FormInstance) => void;
	onFormReady?: (instance: FormInstance) => void;
	onPrevPage?: (page: number, submission: JSON) => void;
	onNextPage?: (page: number, submission: JSON) => void;
	onCancelSubmit?: () => void;
	onCancelComponent?: (component: Component) => void;
	onChange?: (value: any, flags: any, modified: any) => void;
	onCustomEvent?: (event: {
		type: string;
		component: Component;
		data: JSON;
		event?: Event;
	}) => void;
	onComponentChange?: (changed: {
		instance: FormInstance;
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
	onFocus?: (instance: FormInstance) => void;
	onBlur?: (instance: FormInstance) => void;
	onInitialized?: () => void;
	formioform?: FormConstructor;
	Formio?: FormConstructor;
};

const getDefaultEmitter = () => {
	return new EventEmitter({
		wildcard: false,
		maxListeners: 0,
	});
};

const onAnyEvent = (
	handlers: Omit<
		FormProps,
		| 'src'
		| 'url'
		| 'form'
		| 'submission'
		| 'options'
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
};

const createWebformInstance = async (
	FormConstructor: FormConstructor,
	formSource: FormSource,
	element: MutableRefObject<HTMLDivElement>['current'],
	options: FormProps['options'],
) => {
	const instance = new FormConstructor(element, formSource, options);
	return instance.ready;
};

const Form = (props: FormProps) => {
	const formInstance = useRef<FormInstance | null>(null);
	const renderElement = useRef<HTMLDivElement | null>(null);
	const prevFormDefinition = useRef<JSON | null>(null);

	const [formIsReady, setFormIsReady] = useState(false);

	const {
		formioform,
		Formio: FormioProp,
		options = { events: getDefaultEmitter() },
		src,
		submission,
		form,
		url,
		onFormReady,
		...handlers
	} = props;

	// Define effective props and warn about deprecated props
	const effectiveFormConstructor =
		FormioProp !== undefined
			? FormioProp
			: formioform !== undefined
				? formioform
				: (Formio as any).Form;
	if (formioform !== undefined) {
		console.warn(
			'Warning: formioform is deprecated and will be removed in a future release. Please use Formio instead.',
		);
	}
	const effectiveFormSource =
		src !== undefined ? src : form !== undefined ? form : null;
	if (form !== undefined) {
		console.warn(
			'Warning: form is deprecated and will be removed in a future release. Please use src instead.',
		);
	}

	useEffect(() => {
		if (renderElement.current === null) {
			console.warn('Form element not found');
			return;
		}
		if (typeof effectiveFormSource === 'string') {
			createWebformInstance(
				effectiveFormConstructor,
				effectiveFormSource,
				renderElement.current,
				options,
			).then((instance) => {
				if (instance) {
					instance.src = effectiveFormSource;
					instance.onAny((...args: [string, ...any[]]) =>
						onAnyEvent(handlers, ...args),
					);
					if (onFormReady) onFormReady(instance);
					formInstance.current = instance;
					setFormIsReady(true);
				}
			});
		} else if (
			typeof effectiveFormSource === 'object' &&
			!isEqual(effectiveFormSource, prevFormDefinition.current)
		) {
			prevFormDefinition.current = cloneDeep(effectiveFormSource);
			createWebformInstance(
				effectiveFormConstructor,
				effectiveFormSource,
				renderElement.current,
				options,
			).then((instance) => {
				if (instance && effectiveFormSource) {
					instance.form = effectiveFormSource;
					if (url) {
						instance.url = url;
					}
					instance.onAny((...args: [string, ...any[]]) =>
						onAnyEvent(handlers, ...args),
					);
					formInstance.current = instance;
					setFormIsReady(true);
				}
			});
		}
		return () =>
			formInstance.current
				? formInstance.current.destroy(true)
				: undefined;
	}, [
		effectiveFormConstructor,
		effectiveFormSource,
		options,
		handlers,
		url,
		onFormReady,
	]);

	useEffect(() => {
		if (
			formIsReady &&
			formInstance.current &&
			submission &&
			!isEqual(formInstance.current.submission?.data, submission.data)
		) {
			console.log(
				'Setting submission...',
				formInstance.current,
				submission,
			);
			formInstance.current.submission = cloneDeep(submission);
		}
	}, [submission, formIsReady]);

	return <div ref={renderElement} />;
};

export default Form;
