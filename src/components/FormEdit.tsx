import { useRef, ReactNode } from 'react';
import { FormBuilder as FormioFormBuilder } from '@formio/js';
import { FormBuilder, FormBuilderProps } from './FormBuilder';
import { Form, FormOptions, FormType, FormProps } from './Form';
import { ComponentProp } from './FormGrid';
import { useFormioContext } from '../hooks/useFormioContext';
import { Form as CoreFormType } from '@formio/core';

type FormEditProps = {
	initialForm?: FormType;
	settingsForm?: FormType;
	settingsFormOptions?: FormOptions;
	onSettingsFormReady?: FormProps['onFormReady'];
	builderOptions?: FormBuilderProps['options'];
	onBuilderReady?: FormBuilderProps['onBuilderReady'];
	Builder?: FormBuilderProps['Builder'];
	saveFormFn?: (form: FormType) => Promise<CoreFormType>;
	onSaveForm?: (form: FormType) => void;
	components?: {
		Container?: ComponentProp<{ children: ReactNode }>;
		SettingsFormContainer?: ComponentProp<{ children: ReactNode }>;
		BuilderContainer?: ComponentProp<{ children: ReactNode }>;
		SaveButtonContainer?: ComponentProp<{ children: ReactNode }>;
		SaveButton?: ComponentProp<{
			onClick: () => void;
		}>;
	};
};

const DEFAULT_INITAL_FORM = {
	title: '',
	name: '',
	path: '',
	display: 'form' as const,
	type: 'form' as const,
	components: [],
};

export const DEFAULT_SETTINGS_FORM = {
	display: 'form' as const,
	components: [
		{
			label: 'Columns',
			columns: [
				{
					components: [
						{
							label: '<b>Form Title</b>',
							labelPosition: 'left-left',
							applyMaskOn: 'change',
							tableView: true,
							validate: {
								required: true,
							},
							key: 'title',
							type: 'textfield',
							input: true,
						},
						{
							label: '<b>Form Name</b>',
							labelPosition: 'left-left',
							applyMaskOn: 'change',
							tableView: true,
							calculateValue: 'value = _.camelCase(data.title);',
							validate: {
								required: true,
							},
							key: 'name',
							type: 'textfield',
							input: true,
						},
						{
							label: 'Columns',
							columns: [
								{
									components: [
										{
											label: '<b>Path</b>',
											applyMaskOn: 'change',
											tableView: true,
											calculateValue:
												'value = _.camelCase(data.title).toLowerCase();',
											validate: {
												required: true,
											},
											key: 'path',
											type: 'textfield',
											input: true,
										},
									],
									width: 6,
									offset: 0,
									push: 0,
									pull: 0,
									size: 'md',
									currentWidth: 6,
								},
								{
									components: [
										{
											label: '<b>Display As</b>',
											widget: 'choicesjs',
											tableView: true,
											data: {
												values: [
													{
														label: 'Form',
														value: 'form',
													},
													{
														label: 'Wizard',
														value: 'wizard',
													},
													{
														label: 'PDF',
														value: 'pdf',
													},
												],
											},
											validate: {
												required: true,
											},
											key: 'display',
											type: 'select',
											input: true,
											defaultValue: 'form',
										},
									],
									width: 6,
									offset: 0,
									push: 0,
									pull: 0,
									size: 'md',
									currentWidth: 6,
								},
							],
							key: 'columns',
							type: 'columns',
							input: false,
							tableView: false,
						},
					],
					width: 9,
					offset: 0,
					push: 0,
					pull: 0,
					size: 'md',
					currentWidth: 9,
				},
				{
					components: [
						{
							label: 'Tags',
							placeholder: 'Add a tag',
							tableView: false,
							key: 'tags',
							type: 'tags',
							input: true,
						},
					],
					offset: 0,
					push: 0,
					pull: 0,
					size: 'md',
					currentWidth: 3,
					width: 3,
				},
			],
			key: 'columns1',
			type: 'columns',
			input: false,
			tableView: false,
		},
	],
};

const DEFAULT_SETTINGS_FORM_OPTIONS = {};
const DEFAULT_COMPONENTS = {};

export const FormEdit = ({
	initialForm = DEFAULT_INITAL_FORM,
	settingsForm = DEFAULT_SETTINGS_FORM,
	settingsFormOptions = DEFAULT_SETTINGS_FORM_OPTIONS,
	components = DEFAULT_COMPONENTS,
	builderOptions,
	Builder,
	onSaveForm,
	saveFormFn,
	onSettingsFormReady,
	onBuilderReady,
}: FormEditProps) => {
	const { Formio } = useFormioContext();
	const {
		Container = ({ children }) => <div>{children}</div>,
		SettingsFormContainer = ({ children }) => <div>{children}</div>,
		BuilderContainer = ({ children }) => <div>{children}</div>,
		SaveButtonContainer = ({ children }) => <div>{children}</div>,
		SaveButton = ({ onClick }) => (
			<button onClick={onClick} type="button">
				Save Form
			</button>
		),
	} = components;
	const settingsFormData = useRef({
		title: initialForm.title,
		name: initialForm.name,
		path: initialForm.path,
		display: initialForm.display,
	});
	const currentForm = useRef(initialForm);
	const builderRef = useRef<FormioFormBuilder | null>(null);

	const handleSaveForm = async () => {
		const formToSave: FormType = {
			...currentForm.current,
			...settingsFormData.current,
		};
		if (saveFormFn) {
			try {
				const form = await saveFormFn(formToSave);
				onSaveForm?.(form);
			} catch (err) {
				console.error('Error saving form', err);
			}
			return;
		}
		const formio = new Formio(
			`${Formio.projectUrl || Formio.baseUrl}/form`,
		);
		try {
			const form = await formio.saveForm(formToSave);
			onSaveForm?.(form);
		} catch (error) {
			console.error('Error saving form', error);
		}
	};

	const handleBuilderReady = (builder: FormioFormBuilder) => {
		builderRef.current = builder;
		if (onBuilderReady) {
			onBuilderReady(builder);
		}
	};

	return (
		<Container>
			<SettingsFormContainer>
				<Form
					src={settingsForm}
					onFormReady={onSettingsFormReady}
					options={settingsFormOptions}
					submission={{
						data: {
							title: initialForm.title,
							name: initialForm.name,
							path: initialForm.path,
							display: initialForm.display,
						},
					}}
					onChange={({ changed, data }, flags, modified) => {
						if (modified) {
							if (changed.component.key === 'display') {
								builderRef.current?.setDisplay(data.display);
							}
							settingsFormData.current = data;
						}
					}}
				/>
			</SettingsFormContainer>
			<BuilderContainer>
				<FormBuilder
					form={initialForm}
					options={builderOptions}
					Builder={Builder}
					onBuilderReady={handleBuilderReady}
					onChange={(form) => {
						currentForm.current = form;
					}}
				/>
			</BuilderContainer>
			<SaveButtonContainer>
				<SaveButton onClick={handleSaveForm} />
			</SaveButtonContainer>
		</Container>
	);
};
