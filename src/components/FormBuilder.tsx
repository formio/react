import { useEffect, useRef, useState } from 'react';
import { FormBuilder as FormioFormBuilder } from '@formio/js';
import { Component } from '@formio/core';

import { FormType } from './Form';

interface BuilderConstructor {
	new (
		element: HTMLDivElement,
		form: FormType,
		options: FormioFormBuilder['options'],
	): FormioFormBuilder;
}
export type FormBuilderProps = {
	options?: FormioFormBuilder['options'];
	Builder?: BuilderConstructor;
	form?: FormType;
	onBuilderReady?: (builder: FormioFormBuilder) => void;
	onChange?: (form: FormType) => void;
	onSaveComponent?: (
		component: Component,
		original: Component,
		parent: Component,
		path: string,
		index: number,
		isNew: boolean,
		originalComponentSchema: Component,
	) => void;
	onEditComponent?: (component: Component) => void;
	onUpdateComponent?: (component: Component) => void;
	onDeleteComponent?: (
		component: Component,
		parent: Component,
		path: string,
		index: number,
	) => void;
};

const toggleEventHandlers = (
	builder: FormioFormBuilder,
	handlers: Omit<FormBuilderProps, 'options' | 'form' | 'Builder'>,
	shouldAttach: boolean = true,
) => {
	const fn = shouldAttach ? 'on' : 'off';
	const {
		onSaveComponent,
		onEditComponent,
		onUpdateComponent,
		onDeleteComponent,
		onChange,
	} = handlers;
	builder.instance[fn](
		'saveComponent',
		(
			component: Component,
			original: Component,
			parent: Component,
			path: string,
			index: number,
			isNew: boolean,
			originalComponentSchema: Component,
		) => {
			onSaveComponent?.(
				component,
				original,
				parent,
				path,
				index,
				isNew,
				originalComponentSchema,
			);
			onChange?.(builder.instance.form);
		},
	);
	builder.instance[fn]('updateComponent', (component: Component) => {
		onUpdateComponent?.(component);
		onChange?.(builder.instance.form);
	});
	builder.instance[fn](
		'removeComponent',
		(
			component: Component,
			parent: Component,
			path: string,
			index: number,
		) => {
			onDeleteComponent?.(component, parent, path, index);
			onChange?.(builder.instance.form);
		},
	);

	builder.instance[fn]('cancelComponent', (component: Component) => {
		onUpdateComponent?.(component);
		onChange?.(builder.instance.form);
	});

	builder.instance[fn]('editComponent', (component: Component) => {
		onEditComponent?.(component);
		onChange?.(builder.instance.form);
	});

	builder.instance[fn]('addComponent', () => {
		onChange?.(builder.instance.form);
	});

	builder.instance[fn]('pdfUploaded', () => {
		onChange?.(builder.instance.form);
	});
};

const createBuilderInstance = async (
	element: HTMLDivElement,
	BuilderConstructor:
		| BuilderConstructor
		| typeof FormioFormBuilder = FormioFormBuilder,
	form: FormType = { display: 'form', components: [] },
	options: FormBuilderProps['options'] = {},
): Promise<FormioFormBuilder> => {
	options = Object.assign({}, options);
	form = Object.assign({}, form);

	const instance = new BuilderConstructor(element, form, options);

	await instance.ready;
	return instance;
};

const DEFAULT_FORM: FormType = { display: 'form' as const, components: [] };

export const FormBuilder = ({
	options,
	Builder,
	form = DEFAULT_FORM,
	onBuilderReady,
	onChange,
	onDeleteComponent,
	onEditComponent,
	onSaveComponent,
	onUpdateComponent,
}: FormBuilderProps) => {
	const builder = useRef<FormioFormBuilder | null>(null);
	const renderElement = useRef<HTMLDivElement | null>(null);
	const [instanceIsReady, setInstanceIsReady] = useState(false);

	useEffect(() => {
		let ignore = false;
		const createInstance = async () => {
			if (!renderElement.current) {
				console.warn(
					'FormBuilder render element not found, cannot render builder.',
				);
				return;
			}
			const instance = await createBuilderInstance(
				renderElement.current,
				Builder,
				structuredClone(form),
				options,
			);
			if (instance) {
				if (ignore) {
					instance.instance.destroy(true);
					return;
				}

				if (onBuilderReady) {
					onBuilderReady(instance);
				}
				builder.current = instance;
				setInstanceIsReady(true);
			} else {
				console.warn('Failed to create FormBuilder instance');
			}
		};

		createInstance();

		return () => {
			ignore = true;
			setInstanceIsReady(false);
			if (builder.current) {
				builder.current.instance.destroy(true);
			}
		};
	}, [Builder, form, options, onBuilderReady]);

	useEffect(() => {
		if (instanceIsReady && builder.current) {
			toggleEventHandlers(builder.current, {
				onChange,
				onDeleteComponent,
				onEditComponent,
				onSaveComponent,
				onUpdateComponent,
			});
		}

		return () => {
			if (instanceIsReady && builder.current) {
				toggleEventHandlers(builder.current, {
					onChange,
					onDeleteComponent,
					onEditComponent,
					onSaveComponent,
					onUpdateComponent,
				}, false);
			}
		};
	}, [
		instanceIsReady,
		onChange,
		onDeleteComponent,
		onEditComponent,
		onSaveComponent,
		onUpdateComponent,
	]);

	return <div ref={renderElement}></div>;
};
