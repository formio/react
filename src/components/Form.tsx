import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { EventEmitter, Form as FormClass, Webform } from '@formio/js';
import { Component } from '@formio/core/types';

type FormOptions = Webform['options'];
interface FormConstructor {
	new (
		element: HTMLElement,
		formSource: FormSource,
		options: FormOptions,
	): Webform;
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
	formReady?: (instance: Webform) => void;
	onFormReady?: (instance: Webform) => void;
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
	formioform?: FormConstructor;
	Formio?: FormConstructor;
};
type EventHandlerProps = Omit<
	FormProps,
	| 'src'
	| 'url'
	| 'form'
	| 'submission'
	| 'options'
	| 'formReady'
	| 'formioform'
	| 'Formio'
>;

const getDefaultEmitter = () => {
	return new EventEmitter({
		wildcard: false,
		maxListeners: 0,
	});
};

const onAnyEvent = (
	handlers: EventHandlerProps,
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
	FormConstructor: FormConstructor | undefined,
	formSource: FormSource,
	element: MutableRefObject<HTMLDivElement>['current'],
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
	const {
		Formio: FormioProp,
		formioform,
		form,
		src,
		formReady,
		onFormReady,
	} = props;
	const formConstructor = FormioProp !== undefined ? FormioProp : formioform;

	const formSource = form !== undefined ? form : src;

	const formReadyCallback =
		onFormReady !== undefined ? onFormReady : formReady;

	return { formConstructor, formSource, formReadyCallback };
};

const Form = (props: FormProps) => {
	const [formInstance, setFormInstance] = useState<Webform | null>(null);
	const renderElement = useRef<HTMLDivElement | null>(null);
	const prevFormDefinition = useRef<JSON | null>(null);

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
		Formio,
		...handlers
	} = props;

	useEffect(() => () => formInstance?.destroy(), [formInstance]);

	useEffect(() => {
		if (renderElement.current === null) {
			console.warn('Form element not found');
			return;
		}
		if (typeof formSource === 'string') {
			createWebformInstance(
				formConstructor,
				formSource,
				renderElement.current,
				options,
			).then((instance) => {
				if (instance) {
					instance.src = formSource;
					if (formReadyCallback) formReadyCallback(instance);
					setFormInstance(instance);
				}
			});
		} else if (
			typeof formSource === 'object' &&
			!isEqual(formSource, prevFormDefinition.current)
		) {
			prevFormDefinition.current = cloneDeep(formSource);
			createWebformInstance(
				formConstructor,
				formSource,
				renderElement.current,
				options,
			).then((instance) => {
				if (instance && formSource) {
					instance.form = formSource;
					if (url) {
						instance.url = url;
					}
					if (formReadyCallback) formReadyCallback(instance);
					setFormInstance(instance);
				}
			});
		}
	}, [formConstructor, formSource, url, formReadyCallback, options]);

	useEffect(() => {
		if (formInstance && Object.keys(handlers).length > 0) {
			formInstance.onAny((...args: [string, ...any[]]) =>
				onAnyEvent(handlers, ...args),
			);
		}
		return () =>
			formInstance?.offAny((...args: [string, ...any[]]) => {
				onAnyEvent(handlers, ...args);
			});
	}, [formInstance, handlers]);

	useEffect(() => {
		if (formInstance && submission) {
			formInstance.submission = cloneDeep(submission);
		}
	}, [formInstance, submission]);

	return <div ref={renderElement} />;
};

export default Form;
