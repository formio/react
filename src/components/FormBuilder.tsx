import { useEffect, useRef } from 'react';
import { FormBuilder as FormioFormBuilder } from '@formio/js';
import { Component } from '@formio/core';
import structuredClone from '@ungap/structured-clone';

import { FormType } from './Form';

interface BuilderConstructor {
	new(
		element: HTMLDivElement,
		form: FormType,
		options: FormioFormBuilder['options'],
	): FormioFormBuilder;
}
export type FormBuilderProps = {
	options?: FormioFormBuilder['options'];
	Builder?: BuilderConstructor;
	initialForm?: FormType;
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
	initialForm = DEFAULT_FORM,
	onBuilderReady,
	onChange,
	onDeleteComponent,
	onEditComponent,
	onSaveComponent,
	onUpdateComponent,
}: FormBuilderProps) => {
	const builder = useRef<FormioFormBuilder | null>(null);
	const renderElement = useRef<HTMLDivElement | null>(null);

	// Refs to keep the latest callbacks without reattaching events
	const handlersRef = useRef({
		onChange,
		onDeleteComponent,
		onEditComponent,
		onSaveComponent,
		onUpdateComponent,
	});
	useEffect(() => {
		handlersRef.current = {
			onChange,
			onDeleteComponent,
			onEditComponent,
			onSaveComponent,
			onUpdateComponent,
		};
	}, [onChange, onDeleteComponent, onEditComponent, onSaveComponent, onUpdateComponent]);

	useEffect(() => {
		let ignore = false;

		const createInstance = async () => {
			if (!renderElement.current) {
				console.warn('FormBuilder render element not found, cannot render builder.');
				return;
			}
			const instance = await createBuilderInstance(
				renderElement.current,
				Builder,
				structuredClone(initialForm),
				options,
			);

			if (!instance) {
				console.warn('Failed to create FormBuilder instance');
				return;
			}

			if (ignore) {
				instance.instance.destroy(true);
				return;
			}

			// attach handlers here ONCE, immediately after ready
			const inst = instance.instance;
			const fnOn = (ev: string, cb: (...args: any[]) => void) => inst.on(ev, cb);

			const handleSaveComponent = (
				component: Component,
				original: Component,
				parent: Component,
				path: string,
				index: number,
				isNew: boolean,
				originalComponentSchema: Component,
			) => {
				handlersRef.current.onSaveComponent?.(
					component,
					original,
					parent,
					path,
					index,
					isNew,
					originalComponentSchema,
				);
				handlersRef.current.onChange?.(structuredClone(inst.form));
			};

			const handleUpdateComponent = (component: Component) => {
				handlersRef.current.onUpdateComponent?.(component);
				handlersRef.current.onChange?.(structuredClone(inst.form));
			};

			const handleRemoveComponent = (
				component: Component,
				parent: Component,
				path: string,
				index: number,
			) => {
				handlersRef.current.onDeleteComponent?.(component, parent, path, index);
				handlersRef.current.onChange?.(structuredClone(inst.form));
			};

			const handleEditComponent = (component: Component) => {
				handlersRef.current.onEditComponent?.(component);
			};

			const handleAddComponent = () => {
				handlersRef.current.onChange?.(structuredClone(inst.form));
			};

			// Attach events
			fnOn('saveComponent', handleSaveComponent);
			fnOn('updateComponent', handleUpdateComponent);
			fnOn('removeComponent', handleRemoveComponent);
			fnOn('editComponent', handleEditComponent);
			fnOn('addComponent', handleAddComponent);
			fnOn('pdfUploaded', () => handlersRef.current.onChange?.(structuredClone(inst.form)));
			fnOn('setDisplay', () => handlersRef.current.onChange?.(structuredClone(inst.form)));

			// expose instance
			if (onBuilderReady) onBuilderReady(instance);
			builder.current = instance;
		};

		createInstance();

		return () => {
			ignore = true;
			// cleanup instance + unsubscribe
			if (builder.current) {
				builder.current.instance.destroy(true);
			}
		};

	}, []); // should create this instance only one time to avoid problems with listeners inside of webformbuilder.

	// set initial form in current builder instance
	useEffect(() => {
		if (builder.current && initialForm) {
			builder.current.instance.setForm(structuredClone(initialForm));
		}
	}, [initialForm]);
	return <div ref={renderElement}></div>;
};