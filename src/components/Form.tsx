import { CSSProperties, useEffect, useRef, useState } from 'react';
import { EventEmitter, Form as FormClass, Webform } from '@formio/js';
import { Component, Form as CoreFormType } from '@formio/core';

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> &
	Required<Pick<T, K>>;

export type JSON =
	| string
	| number
	| boolean
	| null
	| undefined
	| JSON[]
	| { [key: string]: JSON };
export type FormOptions = FormClass['options'] & { events?: EventEmitter };
export type FormType = PartialExcept<CoreFormType, 'components'>;
export type FormSource = string | FormType;
interface FormConstructor {
	new (
		element: HTMLElement,
		formSource: FormSource,
		options: FormOptions,
	): FormClass;
}
export type EventError =
	| string
	| Error
	| Error[]
	| { message: string }
	| { message: string }[];
export type Submission = {
	data: { [key: string]: JSON };
	metadata?: { [key: string]: JSON };
	state?: string;
} & {
	[key: string]: JSON;
};
export type FormProps = {
	className?: string;
	style?: CSSProperties;
	src: FormSource;
	url?: string;
	form?: FormType;
	submission?: Submission;
	// TODO: once events is typed correctly in @formio/js options, we can remove this override
	options?: FormOptions;
	formioform?: FormConstructor;
	FormClass?: FormConstructor;
	formReady?: (instance: Webform) => void;
	onFormReady?: (instance: Webform) => void;
	onPrevPage?: (page: number, submission: Submission) => void;
	onNextPage?: (page: number, submission: Submission) => void;
	onCancelSubmit?: () => void;
	onCancelComponent?: (component: Component) => void;
	onChange?: (value: any, flags: any, modified: boolean) => void;
	onCustomEvent?: (event: {
		type: string;
		component: Component;
		data: { [key: string]: JSON };
		event?: Event;
	}) => void;
	onComponentChange?: (changed: {
		instance: Webform;
		component: Component;
		value: any;
		flags: any;
	}) => void;
	onSubmit?: (submission: Submission, saved?: boolean) => void;
	onSubmitDone?: (submission: Submission) => void;
	onSubmitError?: (error: EventError) => void;
	onFormLoad?: (form: JSON) => void;
	onError?: (error: EventError | false) => void;
	onRender?: (param: any) => void;
	onAttach?: (param: any) => void;
	onBuild?: (param: any) => void;
	onFocus?: (instance: Webform) => void;
	onBlur?: (instance: Webform) => void;
	onInitialized?: () => void;
	onLanguageChanged?: () => void;
	onBeforeSetSubmission?: (submission: Submission) => void;
	onSaveDraftBegin?: () => void;
	onSaveDraft?: (submission: Submission) => void;
	onRestoreDraft?: (submission: Submission | null) => void;
	onSubmissionDeleted?: (submission: Submission) => void;
	onRequestDone?: () => void;
	otherEvents?: {
		[event: string]: (...args: any[]) => void;
	};
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
			case 'onLanguageChanged':
				if (handlers.onLanguageChanged) handlers.onLanguageChanged();
				break;
			case 'onBeforeSetSubmission':
				if (handlers.onBeforeSetSubmission)
					handlers.onBeforeSetSubmission(args[1]);
				break;
			case 'onSaveDraftBegin':
				if (handlers.onSaveDraftBegin) handlers.onSaveDraftBegin();
				break;
			case 'onSaveDraft':
				if (handlers.onSaveDraft) handlers.onSaveDraft(args[1]);
				break;
			case 'onRestoreDraft':
				if (handlers.onRestoreDraft) handlers.onRestoreDraft(args[1]);
				break;
			case 'onSubmissionDeleted':
				if (handlers.onSubmissionDeleted)
					handlers.onSubmissionDeleted(args[1]);
				break;
			case 'onRequestDone':
				if (handlers.onRequestDone) handlers.onRequestDone();
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
	if (typeof formSource !== 'string') {
		formSource = structuredClone(formSource);
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
	const formInstance = useRef<Webform | null>(null);
	const renderElement = useRef<HTMLDivElement | null>(null);
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
		style,
		className,
		...handlers
	} = props;
	const [instanceIsReady, setInstanceIsReady] = useState(false);

	useEffect(() => {
		let ignore = false;
		const createInstance = async () => {
			if (renderElement.current === null) {
				console.warn('Form element not found');
				return;
			}

			if (typeof formSource === 'undefined') {
				console.warn('Form source not found');
				return;
			}

			const instance = await createWebformInstance(
				formConstructor,
				formSource,
				renderElement.current,
				options,
			);

			if (instance) {
				if (ignore) {
					instance.destroy(true);
					return;
				}
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
				formInstance.current = instance;
				setInstanceIsReady(true);
			} else {
				console.warn('Failed to create form instance');
			}
		};

		createInstance();
		return () => {
			ignore = true;
			if (formInstance.current) {
				formInstance.current.destroy(true);
			}
		};
	}, [
		formConstructor,
		formReadyCallback,
		formSource,
		options,
		url,
		submission,
	]);

	useEffect(() => {
		if (
			instanceIsReady &&
			formInstance.current &&
			Object.keys(handlers).length > 0
		) {
			formInstance.current.onAny((...args: [string, ...any[]]) =>
				onAnyEvent(handlers, ...args),
			);
		}

		return () => {
			if (
				instanceIsReady &&
				formInstance.current &&
				Object.keys(handlers).length > 0
			) {
				formInstance.current.offAny((...args: [string, ...any[]]) =>
					onAnyEvent(handlers, ...args),
				);
			}
		};
	}, [instanceIsReady, handlers]);

	useEffect(() => {
		if (instanceIsReady && formInstance.current && submission) {
			formInstance.current.submission = submission;
		}
	}, [instanceIsReady, submission]);

	return <div className={className} style={style} ref={renderElement} />;
};
