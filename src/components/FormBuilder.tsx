import { useEffect, useRef, useState } from 'react';
import { FormBuilder as FormioFormBuilder, Utils } from '@formio/js';
import { Component } from '@formio/core';
import structuredClone from '@ungap/structured-clone';

import { FormType, FormSource } from './Form';

interface BuilderConstructor {
	new (
		element: HTMLDivElement,
		formSource: FormSource | undefined,
		options: FormioFormBuilder['options'],
	): FormioFormBuilder;
}
export type FormBuilderProps = {
	options?: FormioFormBuilder['options'];
	Builder?: BuilderConstructor;
	initialForm?: FormSource;
	onBuilderReady?: (builder: FormioFormBuilder) => void;
	onChange?: (form: FormType) => void;
	onSaveComponent?: (
		component: Component,
		parent: Component,
		index: number,
		originalComponentSchema: Component,
	) => void;
	onAddComponent?: (
		component: Component,
		parent: Component,
		path: string,
		index: number,
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
	builder.instance?.[fn](
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
				parent,
				index,
				originalComponentSchema,
			);
			onChange?.(structuredClone(builder.instance?.form));
		},
	);
	builder.instance?.[fn]('updateComponent', (component: Component) => {
		onUpdateComponent?.(component);
		onChange?.(structuredClone(builder.instance.form));
	});
	builder.instance?.[fn](
		'removeComponent',
		(
			component: Component,
			parent: Component,
			path: string,
			index: number,
		) => {
			onDeleteComponent?.(component, parent, path, index);
			onChange?.(structuredClone(builder.instance?.form));
		},
	);

	builder.instance?.[fn]('cancelComponent', (component: Component) => {
		onUpdateComponent?.(component);
		onChange?.(structuredClone(builder.instance?.form));
	});

	builder.instance?.[fn]('editComponent', (component: Component) => {
		onEditComponent?.(component);
		onChange?.(structuredClone(builder.instance?.form));
	});

	builder.instance?.[fn]('addComponent', () => {
		onChange?.(structuredClone(builder.instance?.form));
	});

	builder.instance?.[fn]('pdfUploaded', () => {
		onChange?.(structuredClone(builder.instance?.form));
	});
	builder.instance?.[fn]('setDisplay', () => {
		onChange?.(structuredClone(builder.instance?.form));
	});
};

const createBuilderInstance = async (
	BuilderConstructor: BuilderConstructor | undefined,
	formSource: FormSource | undefined,
	element: HTMLDivElement,
	options: FormBuilderProps['options'] = {},
): Promise<FormioFormBuilder> => {
	const builder = BuilderConstructor
		? new BuilderConstructor(element, formSource, options)
		: new FormioFormBuilder(element, formSource, options);

	await builder.ready;
	return builder;
};

export const FormBuilder = ({
	options,
	Builder,
	initialForm,
	onBuilderReady,
	...handlers
}: FormBuilderProps) => {
	const renderElement = useRef<HTMLDivElement | null>(null);
	const [builderInstance, setBuilderInstance] =
		useState<FormioFormBuilder | null>(null);
	const isMounted = useRef(false);
	const currentFormSourceJsonProp = useRef<FormType | null>(null);

	useEffect(() => {
		return () => {
			if (builderInstance) {
				builderInstance.instance?.destroy(true);
				builderInstance.destroy(true);
			}
		};
	}, [builderInstance]);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (
			typeof initialForm === 'object' &&
			currentFormSourceJsonProp.current &&
			Utils._.isEqual(currentFormSourceJsonProp.current, initialForm)
		) {
			return;
		}

		const createInstance = async () => {
			if (!renderElement.current) {
				console.warn(
					'FormBuilder render element not found, cannot render builder.',
				);
				return;
			}

			currentFormSourceJsonProp.current =
				initialForm && typeof initialForm !== 'string'
					? structuredClone(initialForm)
					: null;
			const builder = await createBuilderInstance(
				Builder,
				currentFormSourceJsonProp.current || initialForm,
				renderElement.current,
				options,
			);

			if (builder) {
				if (!isMounted.current) {
					builder.instance?.destroy(true);
					builder.destroy(true);
				}

				if (onBuilderReady) {
					onBuilderReady(builder);
				}
				setBuilderInstance((prevInstance) => {
					if (prevInstance) {
					  prevInstance.instance?.destroy(true);
						prevInstance.destroy(true);
					}
					return builder;
				});
			} else {
				console.warn('Failed to create form builder instance');
			}
		};

		createInstance();
	}, [Builder, initialForm, onBuilderReady, options]);

	useEffect(() => {
		if (builderInstance && Object.keys(handlers).length > 0) {
			toggleEventHandlers(builderInstance, handlers);
		}

		return () => {
			if (builderInstance) {
				toggleEventHandlers(builderInstance, handlers, false);
			}
		};
	}, [builderInstance, handlers]);

	return <div ref={renderElement}></div>;
};
