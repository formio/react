# @formio/react

A [React](http://facebook.github.io/react/) library for rendering out forms based on the [Form.io](https://www.form.io) platform.

## Install

### npm

```bash
npm install @formio/react --save
npm install @formio/js --save
```

### yarn

```bash
yarn add @formio/react @formio/js
```

## Usage with Vite (Note: When using frameworks like Next.js or Create React App, no extra Vite configuration is necessary)

When using @formio/react in a project built with Vite (especially for React 18 and 19), make sure you install the @vitejs/plugin-react package and configure it in your vite.config.js file.

Install Vite React Plugin

```bash
yarn add --dev @vitejs/plugin-react
```

In your vite.config.js, add the React plugin:

```bash
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

## Hooks

### useFormioContext

A hook to supply global Formio contextual values to your React components. **Components that call `useFormioContext` must be children of a `<FormioProvider />` component.**

#### Return Value

`useFormioContext` returns an object with the following parameters:

| Name            | Type          | Description                                                                                                                            |
| --------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Formio          | typeof Formio | The global Formio object. Useful for various static methods as well as SDK functions that are exposed when the `new` operator is used. |
| baseUrl         | string        | The base url for a Form.io server.                                                                                                     |
| projectUrl      | string        | The base url for a Form.io enterprise project.                                                                                         |
| logout          | () => void    | A convenience method to logout of a Form.io session by invalidating the token and removing it from local storage.                      |
| token           | string        | The Form.io JWT-token (if the user is authenticated).                                                                                  |
| isAuthenticated | boolean       | A convenience value that is toggled when logging in or out of a Form.io session.                                                       |

#### Examples

Use the authentication context provided by `useFormioContext` to evaluate the Form.io authentication of a user:

```tsx
import { createRoot } from 'react-dom/client';
import { useFormioContext, FormGrid, FormioProvider } from '@formio/react';

const App = () => {
	const { isAuthenticated } = useFormioContext();

	return isAuthenticated ? (
		<Router>
			<Route path="/form">
				<FormGrid
					formQuery={{ type: 'form' }}
					onFormClick={(id) => setLocation(`/form/${id}`)}
				/>
			</Route>
			<Route path="/resource">
				<FormGrid
					formQuery={{ type: 'resource' }}
					onFormClick={(id) => setLocation(`/resource/${id}`)}
				/>
			</Route>
		</Router>
	) : (
		<Redirect to="/login" />
	);
};

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<App />
	</FormioProvider>,
);
```

Use the [Form.io SDK](https://help.form.io/developers/javascript-development/javascript-sdk) to interact with a Form.io server:

```tsx
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import {
	useFormioContext,
	FormioProvider,
	FormType,
	Form,
} from '@formio/react';

const FormsByUser = ({ userId }: { userId: string }) => {
	const { Formio, projectUrl } = useFormioContext();
	const [forms, setForms] = useState<FormType[]>([]);

	useEffect(() => {
		const fetchForms = async () => {
			const formio = new Formio(projectUrl);
			try {
				const forms = await formio.loadForms({
					params: { type: 'form', owner: userId },
				});
				setForms(forms);
			} catch (err) {
				console.log(
					`Error while loading forms for user ${userId}:`,
					err,
				);
			}
		};
		fetchForms();
	}, [Formio, projectUrl, userId]);

	return forms.map(function (form) {
		return (
			<>
				<Form src={form} />
				<div style={{ marginBottom: '10px' }} />
			</>
		);
	});
};

const domNode = document.getElementById('root');
const root = createRoot(domNode);
const root = createRoot();
root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<App />
	</FormioProvider>,
);
```

### usePagination

A hook to supply limit/skip server pagination data and methods to your React components. **Components that call `usePagination` must be children of a `<FormioProvider />` component.**

#### Props

| Name                | Type                                                 | Description                                                                                                                                            |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| initialPage         | number                                               | The initial page to fetch.                                                                                                                             |
| limit               | string                                               | The number of results per page.                                                                                                                        |
| dataOrFetchFunction | T[] \| (limit: number, skip: number) => Promise<T[]> | Either the complete set of data to be paginated or a function that returns data. If a function, must support limit and skip and be a stable reference. |

#### Return Value

`usePagination` returns an object with the following parameters:

| Name      | Type                   | Description                                                                                                                  |
| --------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| data      | T[]                    | The data at the current page.                                                                                                |
| total     | number \| undefined    | If available, the total number of documents.                                                                                 |
| page      | number                 | The current page number.                                                                                                     |
| hasMore   | boolean                | A value that indicates whether more results are available from the server. Useful when no total document count is available. |
| nextPage  | () => void             | A function that moves the data to the next available page.                                                                   |
| prevPage  | () => void             | A function that moves the data to the previous available page.                                                               |
| fetchPage | (page: number) => void | A function that moves the data to a specified page.                                                                          |

#### Examples

Paginate a set of forms:

```tsx
import { createRoot } from 'react-dom/client';
import { useCallback } from 'react';
import {
	useFormioContext,
	FormioProvider,
	FormType,
	Form,
} from '@formio/react';

const FormsByUser = ({ userId }: { userId: string }) => {
	const { Formio, projectUrl } = useFormioContext();
	const fetchFunction = useCallback(
		(limit: number, skip: number) => {
			const formio = new Formio(`${projectUrl}/form`);
			return formio.loadForms({ params: { type: 'form', limit, skip } });
		},
		[Formio, projectUrl],
	);
	const { data, page, nextPage, prevPage, hasMore } = usePagination<FormType>(
		1,
		10,
		fetchFunction,
	);

	return (
		<div>
			<div>
				{data.map((form) => (
					<>
						<Form src={form} />
						<div style={{ marginBottom: '10px' }} />
					</>
				))}
			</div>
			<ul>
				<li
					onClick={prevPage}
					className={`${page === 1 ? 'disabled' : ''}`}
				>
					Prev
				</li>
				<li
					onClick={nextPage}
					className={`${hasMore ? '' : 'disabled'}`}
				>
					Next
				</li>
			</ul>
		</div>
	);
};

const domNode = document.getElementById('root');
const root = createRoot(domNode);
const root = createRoot();
root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<App />
	</FormioProvider>,
);
```

## Components

### FormioProvider

A React context provider component that is required when using some hooks and components from this library.

#### Props

| Name       | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| Formio     | object | The Formio object to be used.            |
| baseUrl    | string | The base url of a Form.io server.        |
| projectUrl | string | The url of a Form.io enterprise project. |

#### Examples

Render a simple form from your self hosted Form.io deployment:

```JSX
import { createRoot } from 'react-dom/client';
import { Form, FormioProvider } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <FormioProvider baseUrl="https://myformiodeployment.example.com/" projectUrl="https://myformiodeployment.example.com/myproject">
    <Form src="https://myformiodeployment.example.com/myproject/myexampleform" />
  </FormioProvider>
);
```

Extend the Formio object to use external modules:

```JSX
import { createRoot } from 'react-dom/client';
import { Form, FormioProvider } from '@formio/react';
import { Formio } from '@formio/js';
import premium from '@formio/premium';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

Formio.use(premium);
root.render(
  <FormioProvider Formio={Formio}>
    <Form src="https://myproject.form.io/myformwithpremiumcomponents" />
  </FormioProvider>
);
```

### Form

A React component wrapper around [a Form.io form](https://help.form.io/developers/form-development/form-renderer#introduction). Able to take a JSON form definition or a Form.io form URL and render the form in your React application.

#### Props

| Name                | Type                                                                                    | Default | Description                                                                                                                                                                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`               | `Webform \| string`                                                                     |         | The JSON form definition or the source URL. If a URL, commonly from a form.io server.                                                                                                                                                                                                                                                   |
| `url`               | `string`                                                                                |         | The url of the form definition. Used in conjunction with a JSON form definition passed to `src`, this is used for file upload, OAuth, and other components or actions that need to know the URL of the Form.io form for further processing. The form will not be loaded from this url and the submission will not be saved here either. |
| `submission`        | `JSON`                                                                                  |         | Submission data to fill the form. You can either load a previous submission or create a submission with some pre-filled data. If you do not provide a submissions the form will initialize an empty submission using default values from the form.                                                                                      |
| `options`           | `FormOptions`                                                                           |         | The form options. See [here](https://help.form.io/developers/form-development/form-renderer#form-renderer-options) for more details.                                                                                                                                                                                                    |
| `onFormReady`       | `(instance: Webform) => void`                                                           |         | A callback function that gets called when the form has rendered. It is useful for accessing the underlying @formio/js Webform instance.                                                                                                                                                                                                 |
| `onSubmit`          | `(submission: JSON, saved?: boolean) => void`                                           |         | A callback function that gets called when the submission has started. If `src` is not a Form.io server URL, this will be the final submit event.                                                                                                                                                                                        |
| `onCancelSubmit`    | `() => void`                                                                            |         | A callback function that gets called when the submission has been canceled.                                                                                                                                                                                                                                                             |
| `onSubmitDone`      | `(submission: JSON) => void`                                                            |         | A callback function that gets called when the submission has successfully been made to the server. This will only fire if `src` is set to a Form.io server URL.                                                                                                                                                                         |
| `onChange`          | `(value: any, flags: any, modified: any) => void`                                       |         | A callback function that gets called when a value in the submission has changed.                                                                                                                                                                                                                                                        |
| `onComponentChange` | `(changed: { instance: Webform; component: Component; value: any; flags: any}) => void` |         | A callback function that gets called when a specific component changes.                                                                                                                                                                                                                                                                 |
| `onError`           | `(error: EventError \| false) => void`                                                  |         | A callback function that gets called when an error occurs during submission (e.g. a validation error).                                                                                                                                                                                                                                  |
| `onRender`          | `(param: any) => void`                                                                  |         | A callback function that gets called when the form is finished rendering. `param` will depend on the form and display type.                                                                                                                                                                                                             |
| `onCustomEvent`     | `(event: { type: string; component: Component; data: JSON; event?: Event; }) => void`   |         | A callback function that is triggered from a button component configured with "Event" type.                                                                                                                                                                                                                                             |
| `onPrevPage`        | `(page: number, submission: JSON) => void`                                              |         | A callback function for Wizard forms that gets called when the "Previous" button is pressed.                                                                                                                                                                                                                                            |
| `onNextPage`        | `(page: number, submission: JSON) => void`                                              |         | A callback function for Wizard forms that gets called when the "Next" button is pressed.                                                                                                                                                                                                                                                |
| `otherEvents`       | `[event: string]: (...args: any[]) => void;`                                            |         | A "catch-all" prop for subscribing to other events (for a complete list, see [our documentation](https://help.form.io/developers/form-development/form-renderer#form-events)).                                                                                                                                                          |

#### Examples

Render a simple form from the Form.io SaaS:

```JSX
import { createRoot } from 'react-dom/client';
import { Form } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<Form src="https://example.form.io/example" onSubmit={console.log} />,
);
```

Render a simple form from a JSON form definition:

```JSX
import { createRoot } from 'react-dom/client';
import { Form } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

const formDefinition = {
	type: "form",
	display: "form",
	components: [
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "button",
			key: "submit",
			label: "Submit",
			input: true
		}
	]
}

root.render(<Form src={formDefinition} />);
```

Access the underlying form instance (see [here](https://help.form.io/developers/form-development/form-renderer#form-properties) for details):

```JSX
import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Form } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

const formDefinition = {
	type: "form",
	display: "form",
	components: [
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "button",
			key: "submit",
			label: "Submit",
			input: true
		}
	]
}

const App = () => {
	const formInstance = useRef(null);

	const handleFormReady = (instance) => {
		formInstance.current = instance;
	}

	const handleClick = () => {
		if (!formInstance.current) {
			console.log("Our form isn't quite ready yet.");
			return;
		}
		formInstance.current.getComponent('firstName')?.setValue('John');
		formInstance.current.getComponent('lastName')?.setValue('Smith');
	}

	return (
		<div>
			<Form src={formDefinition} onFormReady={handleFormReady} />
			<button type="button" onClick={handleClick}>Set Names</button>
		</div>
	);
}

root.render(<App />);
```

#### Usage in Next.js

A number of dependencies in the `@formio/js` rely on web APIs and browser-specific globals like `window`. Because Next.js includes a server-side rendering stage, this makes it difficult to import the Form component directly, even when used in [client components](https://nextjs.org/docs/app/building-your-application/rendering/client-components). For this reason, we recommend dynamically importing the Form component using Next.js' `dynamic` API:

```tsx
'use client';
import dynamic from 'next/dynamic';
import { Webform } from '@formio/js';

const Form = dynamic(
	() => import('@formio/react').then((module) => module.Form),
	{ ssr: false },
);

export default function Home() {
	const formInstance = useRef<Webform | null>(null);

	const handleClick = () => {
		if (!formInstance.current) {
			console.log("Our form isn't quite ready yet.");
			return;
		}
		formInstance.current.getComponent('firstName')?.setValue('John');
		formInstance.current.getComponent('lastName')?.setValue('Smith');
	};

	return (
		<main className={styles.main}>
			<Form
				form="https://examples.form.io/example"
				onFormReady={(instance) => {
					formInstance.current = instance;
				}}
			/>
			<button onClick={handleClick}>Set Names</button>
		</main>
	);
}
```

### FormBuilder

A React component wrapper around [a Form.io form builder](https://help.form.io/developers/form-development/form-builder). Able to render the form builder in your React application.

#### Props

| Name                | Type                                                                                                                                                       | Default | Description                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialForm`       | `FormType`                                                                                                                                                 |         | The JSON form definition of the initial form to be rendered in the builder. Oftentimes, this must be a stable reference; otherwise it may destroy and recreate the underlying builder instance and cause unexpected behavior. |
| `options`           | `FormBuilderOptions`                                                                                                                                       |         | The form builder options. See [here](https://help.form.io/developers/form-development/form-builder#form-builder-options) for more details.                                                                                    |
| `onBuilderReady`    | `(instance: FormBuilder) => void`                                                                                                                          |         | A callback function that gets called when the form builder has rendered. It is useful for accessing the underlying @formio/js FormBuilder instance.                                                                           |
| `onChange`          | `(form: FormType) => void`                                                                                                                                 |         | A callback function that gets called when the form being built has changed.                                                                                                                                                   |
| `onSaveComponent`   | `(component: Component, original: Component, parent: Component, path: string, index: number, isNew: boolean, originalComponentSchema: Component) => void;` |         | A callback function that gets called when a component is saved in the builder.                                                                                                                                                |
| `onEditComponent`   | `(component: Component) => void`                                                                                                                           |         | A callback function that gets called when a component is edited.                                                                                                                                                              |
| `onUpdateComponent` | `(component: Component) => void`                                                                                                                           |         | A callback function that is called when a component is updated.                                                                                                                                                               |
| `onDeleteComponent` | `(component: Component, parent: Component, path: string, index: number) => void`                                                                           |         | A callback function that is called when a component is deleted.                                                                                                                                                               |

#### Examples

Render a simple form builder with a blank form:

```JSX
import { createRoot } from 'react-dom/client';
import { FormBuilder } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<FormBuilder />,
);
```

Render a builder with an initial form definition:

```JSX
import { createRoot } from 'react-dom/client';
import { FormBuilder } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

const formDefinition = {
	display: "form",
	components: [
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "button",
			key: "submit",
			label: "Submit",
			input: true
		}
	]
}

root.render(<FormBuilder form={formDefinition} />);
```

Access the underlying form builder instance (see [here](https://help.form.io/developers/form-development/form-builder#form-builder-sdk) for details):

```JSX
import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { FormBuilder } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

const formDefinition = {
	display: "form",
	components: [
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "textfield"
			key: "firstName",
			label: "First Name",
			input: true,
		},
		{
			type: "button",
			key: "submit",
			label: "Submit",
			input: true
		}
	]
}

const App = () => {
	const formBuilderInstance = useRef(null);

	const handleFormReady = (instance) => {
		formBuilderInstance.current = instance;
	}

	const handleClick = () => {
		if (!formBuilderInstance.current) {
			console.log("Our form isn't quite ready yet.");
			return;
		}
		console.log("Here's our builder instance:", formBuilderInstance.current);
	}

	return (
		<div>
			<Form src={formDefinition} onFormReady={handleFormReady} />
			<button type="button" onClick={handleClick}>Log Our Builder</button>
		</div>
	);
}

root.render(<App />);
```

### FormEdit

The FormEdit component wraps the FormBuilder component and adds a settings form, enabling direct interaction with forms to and from a Form.io server. **The `FormEdit` component must be a child of a `<FormioProvider />` component.**

#### Props

| Name                  | Type                                        | Default                                                                                              | Description                                                                                                                                                                                |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `initialForm`         | `FormType`                                  | `{ title: '', name: '', path: '', display: 'form' as const, type: 'form' as const, components: [] }` | The form definition of the existing form that is to be modified.                                                                                                                           |
| `settingsForm`        | `FormType`                                  | `DEFAULT_SETTINGS_FORM`                                                                              | The form definition for the "settings" form, which defaults to a form that defines the title, name, path, tags, and display of the form being edited.                                      |
| `settingsFormOptions` | `FormOptions`                               | `{}`                                                                                                 | The options passed to the settings form.                                                                                                                                                   |
| `onSettingsFormReady` | `(instance: Webform) => void`               |                                                                                                      | The `onFormReady` callback for the settings form.                                                                                                                                          |
| `onBuilderReady`      | `(instance: FormioBuilder) => void`         |                                                                                                      | The `onBuilderReady` callback for the form builder.                                                                                                                                        |
| `builderOptions`      | `FormBuilderOptions`                        | `{}`                                                                                                 | The options to be passed to FormBuilder.                                                                                                                                                   |
| `saveFormFn`          | `(form: FormType) => Promise<CoreFormType>` |                                                                                                      | Defaults to using the Form.io SDK to save the form to a Form.io server configured by `<FormioProvider />`.                                                                                 |
| `onSaveForm`          | `(form: FormType) => void`                  |                                                                                                      | The callback that is called after `saveFormFn` is called (either the prop or the default). An optional function that replaces the default behavior of saving the form to a Form.io server. |

#### Styling

`FormEdit` takes a `components` prop that contains each "element" of the `FormEdit` component, allowing you to inject your own markup and styling. Here is its type:

```ts
type ComponentProp<T = object> = (props: T) => JSX.Element;
type Components = {
	Container?: ComponentProp<{ children: ReactNode }>;
	SettingsFormContainer?: ComponentProp<{ children: ReactNode }>;
	BuilderContainer?: ComponentProp<{ children: ReactNode }>;
	SaveButtonContainer?: ComponentProp<{ children: ReactNode }>;
	SaveButton?: ComponentProp<{
		onClick: () => void;
	}>;
};
```

#### Examples

Load a simple `FormEdit` component that loads a form from a Form.io server:

```tsx
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import {
	FormGrid,
	FormioProvider,
	useFormioContext,
	FormType,
} from '@formio/react';

const App = () => {
	const { Formio, projectUrl } = useFormioContext();
	const [form, setForm] = useState<FormType | undefined>();

	useEffect(() => {
		const fetchForm = async () => {
			try {
				const formio = new Formio(`${projectUrl}/example`);
				const form = await formio.loadForm();
				setForm(form);
			} catch (err) {
				console.log('Error while fetching form:', err);
			}
		};
	}, [Formio, projectUrl]);

	return form ? (
		<FormEdit
			initialForm={form}
			onSaveForm={() => console.log('Form saved to my Form.io server!')}
		/>
	) : null;
};
const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<App />
	</FormioProvider>,
);
```

Inject your own markup and styling into constituent components:

```tsx
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import {
	FormEdit,
	FormioProvider,
	useFormioContext,
	FormType,
} from '@formio/react';

const App = ({ name }: { name: string }) => {
	const { Formio, projectUrl } = useFormioContext();
	const [form, setForm] = useState<FormType | undefined>();

	useEffect(() => {
		const fetchForm = async () => {
			try {
				const formio = new Formio(`${projectUrl}/example`);
				const form = await formio.loadForm();
				setForm(form);
			} catch (err) {
				console.log('Error while fetching form:', err);
			}
		};
	}, [Formio, projectUrl]);

	return form ? (
		<FormEdit
			initialForm={form}
			onSaveForm={() => console.log('Form saved to my Form.io server!')}
			components={{
				SaveButtonContainer: ({ children }) => (
					<div
						className="save-form-bar button-wrap"
						style={{ justifyContent: 'end' }}
					>
						{children}
					</div>
				),
				SaveButton: ({ onClick }) => (
					<button className="button save-form" onClick={onClick}>
						Save {name}
					</button>
				),
			}}
		/>
	) : null;
};
const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<App name="Form" />
	</FormioProvider>,
);
```

### FormGrid

The FormGrid component can be used to render a list of forms with a set of actions on each row. **The `FormGrid` component must be a child of a `<FormioProvider />` component.**

#### Props

| Name          | Type                               | Default           | Description                                                                                                                                                                                                                      |
| ------------- | ---------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `actions`     | `Action[]`                         | `DEFAULT_ACTIONS` | An array of actions that correspond to buttons on each form grid row. Defaults to an Edit action (which will call the `onFormClick` function prop) and a Delete action (which will use the Form.io SDK to soft delete the form). |
| `forms`       | `FormType[]`                       |                   | If you'd like to manage fetching yourself, you can pass an array of forms to `FormGrid`.                                                                                                                                         |
| `formQuery`   | `Record<string, JSON>`             | `{}`              | If you don't pass the `forms` prop, `FormGrid` will use the Form.io SDK to fetch forms based on the `formQuery` prop.                                                                                                            |
| `onFormClick` | `(id: string) => void`             |                   | A callback function called when the `FormNameContainer` is clicked.                                                                                                                                                              |
| `limit`       | `number`                           | `10`              | The page size limit used by `usePagination`.                                                                                                                                                                                     |
| `components`  | `Record<string, ComponentProp<T>>` | `{}`              | The list of styleable components. See [Styling](#Styling) for details.                                                                                                                                                           |

#### Styling

`FormGrid` takes a `components` prop that contains each "element" of the `FormGrid` component, allowing you to inject your own markup and styling. Here is its type:

```ts
type ComponentProp<T = object> = (props: T) => JSX.Element;
type Components = {
	Container?: ComponentProp<{ children: ReactNode }>;
	FormContainer?: ComponentProp<{ children: ReactNode }>;
	FormNameContainer?: ComponentProp<{
		children: ReactNode;
		onClick?: () => void;
	}>;
	FormActionsContainer?: ComponentProp<{ children: ReactNode }>;
	FormActionButton?: ComponentProp<{
		action: Action;
		onClick: () => void;
	}>;
	PaginationContainer?: ComponentProp<{ children: ReactNode }>;
	PaginationButton?: ComponentProp<{
		children: ReactNode;
		isActive?: boolean;
		disabled?: boolean;
		onClick: () => void;
	}>;
};
```

#### Examples

Load a simple form grid that fetchs forms from a Form.io server (configured via the `<FormioProvider />` component):

```tsx
import { createRoot } from 'react-dom/client';
import { FormGrid, FormioProvider } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<FormGrid formQuery={{ type: 'form' }} />
	</FormioProvider>,
);
```

Inject your own markup and styling into constituent components:

```tsx
import { FormGridProps, FormGrid } from '@formio/react';
import { createRoot } from 'react-dom/client';

const Container: FormGridComponentProps['Container'] = ({ children }) => (
	<div className="panel">{children}</div>
);

const FormContainer: FormGridComponentProps['FormContainer'] = ({
	children,
}) => (
	<div className={`item-wrap form`}>
		<button className="item">{children}</button>
	</div>
);

const FormNameContainer: FormGridComponentProps['FormNameContainer'] = ({
	children,
	onClick,
}) => {
	return (
		<div className="item-title" onClick={onClick}>
			<img src={`icon-form.svg`} alt={`${type} icon`} />
			{children}
		</div>
	);
};

const FormActionsContainer: FormGridComponentProps['FormActionsContainer'] = ({
	children,
}) => <div className="item-buttons">{children}</div>;

const FormActionButton: FormGridComponentProps['FormActionButton'] = ({
	action,
	onClick,
}) => (
	<a
		className={`btn ${action && action.name === 'Edit' ? 'edit' : 'trash'}`}
		onClick={onClick}
	>
		<i
			className={`${action && action.name === 'Edit' ? 'ri-edit-box-line' : 'ri-delete-bin-line'}`}
		></i> {action && action.name === 'Edit' ? 'Edit' : ''}
	</a>
);

const PaginationContainer: FormGridComponentProps['PaginationContainer'] = ({
	children,
}) => <div className="pagination-buttons">{children}</div>;

const PaginationButton: FormGridComponentProps['PaginationButton'] = ({
	isActive,
	disabled,
	children,
	onClick,
}) => (
	<a
		className={`pagination-btn${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`}
		onClick={onClick}
	>
		{children}
	</a>
);

export const MyFormGrid = () => {
	return (
		<FormGrid
			formQuery={{ type: 'form' }}
			onFormClick={(id) => console.log(`Form with id ${id} clicked!`)}
			components={{
				Container,
				FormContainer,
				FormNameContainer,
				FormActionsContainer,
				FormActionButton,
				PaginationContainer,
				PaginationButton,
			}}
		/>
	);
};

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<MyFormGrid />
	</FormioProvider>,
);
```

### SubmissionGrid

The SubmissionGrid component can be used to render a list of forms with a set of actions on each row. **The `SubmissionGrid` component must be a child of a `<FormioProvider />` component.**

#### Props

| Name                | Type                               | Default | Description                                                                                                                              |
| ------------------- | ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `submissions`       | `Submission[]`                     |         | If you'd like to manage fetching yourself, you can pass an array of submissions to `SubmissionGrid`.                                     |
| `formId`            | `string`                           |         | The id of the form whose submissions `SubmissionGrid` will fetch if the `submissions` prop is not provided.                              |
| `submissionQuery`   | `Record<string, JSON>`             | `{}`    | If you don't pass the `submissions` prop, `SubmissionsGrid` will use the Form.io SDK to fetch forms based on the `submissionQuery` prop. |
| `onSubmissionClick` | `(id: string) => void`             |         | A callback function called when the `TableBodyRowContainer` constituent component is clicked.                                            |
| `limit`             | `number`                           | `10`    | The page size limit used by `usePagination`.                                                                                             |
| `components`        | `Record<string, ComponentProp<T>>` | `{}`    | The list of styleable components. See [Styling](#Styling) for details.                                                                   |

#### Styling

`SubmissionGrid` takes a `components` prop that contains each constituent "element" of the `SubmissionGrid` component, allowing you to inject your own markup and styling. Here is its type:

```ts
type ComponentProp<T = object> = (props: T) => JSX.Element;
type Components = {
	Container?: ComponentProp<{ children: ReactNode }>;
	TableContainer?: ComponentProp<{ children: ReactNode }>;
	TableHeadContainer?: ComponentProp<{ children: ReactNode }>;
	TableHeadCell?: ComponentProp<{ children: ReactNode }>;
	TableBodyRowContainer?: ComponentProp<{
		children: ReactNode;
		onClick?: () => void;
	}>;
	TableHeaderRowContainer?: ComponentProp<{ children: ReactNode }>;
	TableBodyContainer?: ComponentProp<{ children: ReactNode }>;
	TableCell?: ComponentProp<{ children: ReactNode }>;
	PaginationContainer?: ComponentProp<{ children: ReactNode }>;
	PaginationButton?: ComponentProp<{
		children: ReactNode;
		isActive?: boolean;
		disabled?: boolean;
		onClick: () => void;
	}>;
};
```

#### Examples

Load a simple submission grid that fetchs forms from a Form.io server (configured via the `<FormioProvider />` component):

```tsx
import { createRoot } from 'react-dom/client';
import { SubmissionGrid, FormioProvider } from '@formio/react';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<SubmissionGrid formId="57aa1d2a5b7a477b002717fe" />
	</FormioProvider>,
);
```

Inject your own markup and styling into constituent components:

```tsx
import { SubmissionGridProps, SubmissionGrid } from '@formio/react';
import { createRoot } from 'react-dom/client';

const components: SubmissionTableProps['components'] = {
	Container: ({ children }) => <div className="table-wrap">{children}</div>,
	TableContainer: ({ children }) => (
		<div className="table remember-focus-table">{children}</div>
	),
	TableHeadContainer: ({ children }) => <div>{children}</div>,
	TableHeaderRowContainer: ({ children }) => (
		<div className="trow heading">{children}</div>
	),
	TableHeadCell: ({ children }) => <div className="tcol">{children}</div>,
	TableBodyRowContainer: ({ children, onClick }) => (
		<div className="trow entry" onClick={onClick}>
			{children}
		</div>
	),
	TableBodyContainer: ({ children }) => <div>{children}</div>,
	TableCell: ({ children }) => <div className="tcol">{children}</div>,
	PaginationContainer: ({ children }) => (
		<div className="table-pagination">
			<div className="table-pagination-controls">{children}</div>
		</div>
	),
	PaginationButton: ({ children, isActive, onClick, disabled }) => (
		<a
			className={`pagination-btn${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`}
			onClick={onClick}
		>
			{children}
		</a>
	),
};

export const MySubmissionGrid = ({ id }: { id: string }) => {
	return (
		<SubmissionGrid
			onSubmissionClick={(id) =>
				console.log(`Submission with id ${id} clicked!`)
			}
			components={components}
			formId={id}
		/>
	);
};

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
	<FormioProvider projectUrl="https://examples.form.io">
		<MySubmissionGrid id="57aa1d2a5b7a477b002717fe" />
	</FormioProvider>,
);
```

## Modules

Modules contain Redux actions, reducers, constants and selectors to simplify the API requests made for form.io forms. Reducers, actions and selectors all have names. This provides namespaces so the same actions and reducers can be re-used within the same redux state.

### root

The root module is the container for things shared by other modules such as the selectRoot selector.

#### Selectors

| Name             | Parameters                  | Description                             |
| ---------------- | --------------------------- | --------------------------------------- |
| `selectRoot`     | name: string, state: object | Returns the state for a namespace.      |
| `selectError`    | name: string, state: object | Returns any errors for a namespace.     |
| `selectIsActive` | name: string, state: object | Returns isActive state for a namespace. |

### auth

The auth module is designed to make it easier to login, register and authenticate users within react using the form.io login system.

#### Reducers

| Name   | Parameters     | Description                                                                                                                                              |
| ------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth` | config: object | Mounts the user and access information to the state tree. Config is not currently used but is a placeholder to make it consistent to the other reducers. |

#### Actions

| Name       | Parameters   | Description                                                                                                                                                                            |
| ---------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initAuth` |              | This is usually used at the start of an app code. It will check the localStorage for an existing user token and if found, log them in and fetch the needed information about the user. |
| `setUser`  | user: object | When a user logs in, this will set the user and fetch the access information for that user. The user object is usually a submission from the login or register form.                   |
| `logout`   |              | This action will reset everything to the default state, including removing any localStorage information.                                                                               |

### form

The form module is for interacting with a single form.

#### Reducers

| Name   | Parameters     | Description                                                                                                                     |
| ------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `form` | config: object | Mounts the form to the state tree. The config object should contain a name property defining a unique name for the redux state. |

#### Actions

| Name         | Parameters                                                                                                                     | Description                                                                                                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getForm`    | name: string, id: string, done: function                                                                                       | Fetch a form from the server. If no id is provided, the name is used as the path. The `done` callback will be called when the action is complete. The first parameter is any errors and the second is the form definition.                                                  |
| `saveForm`   | name: string, form: object, done: function                                                                                     | Save a form to the server. It will use the \_id property on the form to save it if it exists. Otherwise it will create a new form. The `done` callback will be called when the action is complete. The first parameter is any errors and the second is the form definition. |
| `deleteForm` | name: string, id: string, done: function                                                                                       | Delete the form on the server with the id.                                                                                                                                                                                                                                  |
| `resetForm`  | Reset this reducer back to its initial state. This is automatically called after delete but can be called other times as well. |

#### Selectors

| Name         | Parameters                  | Description                                |
| ------------ | --------------------------- | ------------------------------------------ |
| `selectForm` | name: string, state: object | Select the form definition from the state. |

### forms

The forms module handles multiple forms like a list of forms.

#### Reducers

| Name    | Parameters     | Description                                                                                                                                                                                                                                                                                                                     |
| ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `forms` | config: object | Mounts the forms to the state tree. The config object should contain a name property defining a unique name for the redux state. The config object can also contain a query property which is added to all requests for forms. For example: {tags: 'common'} would limit the lists of forms to only forms tagged with 'common'. |

#### Actions

| Name         | Parameters                                                                                                                     | Description                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `getForms`   | name: string, page: integer, params: object                                                                                    | Fetch a list of forms from the server. `params` is a query object to filter the forms. |
| `resetForms` | Reset this reducer back to its initial state. This is automatically called after delete but can be called other times as well. |

#### Selectors

| Name          | Parameters                  | Description                              |
| ------------- | --------------------------- | ---------------------------------------- |
| `selectForms` | name: string, state: object | Select the list of forms from the state. |

### submission

The submission module is for interacting with a single submission.

#### Reducers

| Name         | Parameters     | Description                                                                                                                           |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `submission` | config: object | Mounts the submission to the state tree. The config object should contain a name property defining a unique name for the redux state. |

#### Actions

| Name               | Parameters                                                                                                                     | Description                                                                                                                                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getSubmission`    | name: string, id: string, formId: string, done: function                                                                       | Fetch a submission from the server. The `done` callback will be called when the action is complete. The first parameter is any errors and the second is the submission.                                                                                                                  |
| `saveSubmission`   | name: string, submission: object, formId: string, done: function                                                               | Save a submission to the server. It will use the \_id property on the submission to save it if it exists. Otherwise it will create a new submission. The `done` callback will be called when the action is complete. The first parameter is any errors and the second is the submission. |
| `deleteSubmission` | name: string, id: string, formId: string, done: function                                                                       | Delete the submission on the server with the id.                                                                                                                                                                                                                                         |
| `resetSubmission`  | Reset this reducer back to its initial state. This is automatically called after delete but can be called other times as well. |

#### Selectors

| Name               | Parameters                  | Description                                |
| ------------------ | --------------------------- | ------------------------------------------ |
| `selectSubmission` | name: string, state: object | Select the submission data from the state. |

### submissions

The submissions module handles multiple submissions within a form, like for a list of submissions.

#### Reducers

| Name          | Parameters     | Description                                                                                                                            |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `submissions` | config: object | Mounts the submissions to the state tree. The config object should contain a name property defining a unique name for the redux state. |

#### Actions

| Name               | Parameters                                                                                                                     | Description                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `getSubmissions`   | name: string, page: integer, params: object, formId: string                                                                    | Fetch a list of submissions from the server. `params` is a query object to filter the submissions. |
| `resetSubmissions` | Reset this reducer back to its initial state. This is automatically called after delete but can be called other times as well. |

#### Selectors

| Name                | Parameters                  | Description                                    |
| ------------------- | --------------------------- | ---------------------------------------------- |
| `selectSubmissions` | name: string, state: object | Select the list of submissions from the state. |

## License

Released under the [MIT License](http://www.opensource.org/licenses/MIT).
