# @formio/react

A [React](http://facebook.github.io/react/) library for rendering out forms based on the [Form.io](https://www.form.io) platform.

## Example Application

To see an example application of how to implement all the components and modules in this library, see [https://github.com/formio/react-app-starterkit](https://github.com/formio/react-app-starterkit)

## Install

### npm

`@formio/react` can be used on the server, or bundled for the client using an
npm-compatible packaging system such as [Browserify](http://browserify.org/) or
[webpack](http://webpack.github.io/).

```bash
npm install @formio/react --save
npm install @formio/js --save # Install @formio/js since it is a peerDependency
```

### yarn

```bash
yarn add @formio/react @formio/js
```

## Components

### Form

A React component wrapper around [a Form.io form](https://help.form.io/developers/form-development/form-renderer#introduction). Able to take a JSON form definition or a Form.io form URL and render the form in your React application.

#### Props

| Name            | Type                                                                                  | Default | Description                                                                                                                                                                                                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`           | `Webform \| string`                                                                   |         | The JSON form definition or the source URL. If a URL, commonly from a form.io server.                                                                                                                                                                                                                                                   |
| `url`           | `string`                                                                              |         | The url of the form definition. Used in conjunction with a JSON form definition passed to `src`, this is used for file upload, OAuth, and other components or actions that need to know the URL of the Form.io form for further processing. The form will not be loaded from this url and the submission will not be saved here either. |
| `submission`    | `JSON`                                                                                |         | Submission data to fill the form. You can either load a previous submission or create a submission with some pre-filled data. If you do not provide a submissions the form will initialize an empty submission using default values from the form.                                                                                      |
| `options`       | `JSON`                                                                                |         | The form options. See [here](https://help.form.io/developers/form-development/form-renderer#form-renderer-options) for more details.                                                                                                                                                                                                    |
| `onFormReady`   | `(instance: Webform) => void`                                                         |         | A callback function that gets called when the form has rendered. It is useful for accessing the underlying @formio/js Webform instance.                                                                                                                                                                                                 |
| `onSubmit`      | `(submission: JSON, saved?: boolean) => void`                                         |         | A callback function that gets called when the submission has started. If `src` is not a Form.io server URL, this will be the final submit event.                                                                                                                                                                                        |
| `onSubmitDone`  | `(submission: JSON) => void`                                                          |         | A callback function that gets called when the submission has successfully been made to the server. This will only fire if `src` is set to a Form.io server URL.                                                                                                                                                                         |
| `onChange`      | `(value: any, flags: any, modified: any) => void`                                     |         | A callback function that gets called when a value in the submission has changed.                                                                                                                                                                                                                                                        |
| `onError`       | `(error: EventError \| false) => void`                                                |         | A callback function that gets called when an error occurs during submission (e.g. a validation error).                                                                                                                                                                                                                                  |
| `onRender`      | `(param: any) => void`                                                                |         | A callback function that gets called when the form is finished rendering. `param` will depend on the form and display type.                                                                                                                                                                                                             |
| `onCustomEvent` | `(event: { type: string; component: Component; data: JSON; event?: Event; }) => void` |         | A callback function that is triggered from a button component configured with "Event" type.                                                                                                                                                                                                                                             |
| `onPrevPage`    | `(page: number, submission: JSON) => void`                                            |         | A callback function for Wizard forms that gets called when the "Previous" button is pressed.                                                                                                                                                                                                                                            |
| `onNextPage`    | `(page: number, submission: JSON) => void`                                            |         | A callback function for Wizard forms that gets called when the "Next" button is pressed.                                                                                                                                                                                                                                                |

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

```TSX
'use client';
import dynamic from "next/dynamic";
import { Webform } from "@formio/js";

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
	}

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

The FormBuilder class can be used to embed a form builder directly in your react application. Please note that you'll need to include the CSS for the form builder from formio.js as well.

```javascript
import { FormBuilder } from '@formio/react';
```

Without Components:

```javascript
<FormBuilder form={[]} />
```

With Components:

```javascript
<FormBuilder
	form={{
		display: 'form',
		components: [
			{
				label: 'Email',
				tableView: true,
				key: 'email',
				type: 'email',
				input: true,
			},
			{
				label: 'Password',
				tableView: false,
				key: 'password',
				type: 'password',
				input: true,
				protected: true,
			},
		],
	}}
/>
```

Please note that the FormBuilder component does not load and save from/to a url. You must handle the form definition loading and saving yourself or use the FormEdit component.

#### Props

| Name      | Type   | Default | Description                                                                                                                                  |
| --------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `form`    | object |         | This is the form definition object. It should at least have a `display` property set to form, wizard or pdf.                                 |
| `options` | object |         | an options object that can pass options to the formio.js Form that is rendered. There are many options to be found in the formio.js library. |

#### Event Props

| Name                | Parameters          | Description                                                       |
| ------------------- | ------------------- | ----------------------------------------------------------------- |
| `onChange`          | `schema`: object    | Triggered any time the form definition changes.                   |
| `onEditComponent`   | `component`: object | Triggered when the component settings dialog is opened.           |
| `onSaveComponent`   | `component`: object | Triggered when the component settings dialog is saved and closed. |
| `onCancelComponent` | `component`: object | Triggered when the component settings dialog is cancelled.        |
| `onDeleteComponent` | `component`: object | Triggered when a component is removed from the form.              |
| `onUpdateComponent` | `component`: object | Triggered when a component is added or moved in the form.         |

#### Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { FormBuilder } from '@formio/react';
```

```javascript
ReactDOM.render(
	<FormBuilder
		form={{ display: 'form' }}
		onChange={(schema) => console.log(schema)}
	/>,
	document.getElementById('builder'),
);
```

### Errors

The Errors component can be used to print out errors that can be generated within an application. It can handle many types of errors that are generated by the form.io actions.

#### Props

| Name     | Type   | Default  | Description                                                                                                                                                            |
| -------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `errors` | any    | null     | If null is passed, the component is not rendered. Otherwise it will render the errors. There are various formats (including an array of errors) that can be passed in. |
| `type`   | string | 'danger' | The bootstrap alert type to render the container.                                                                                                                      |

#### Event Props

None

### FormEdit

The FormEdit component wraps the FormBuilder component and adds the title, display, name and path fields at the top along with a save button.

#### Props

| Name       | Type   | Default                       | Description                                                     |
| ---------- | ------ | ----------------------------- | --------------------------------------------------------------- |
| `form`     | object | {display: 'form' \| 'wizard'} | The form definition of the exiting form that is to be modified. |
| `options`  | object | {}                            | The options to be passed to FormBuilder.                        |
| `saveText` | string | ''                            | The string that will be displayed in the save-button.           |

#### Event Props

| Name       | Parameters | Description                                                                            |
| ---------- | ---------- | -------------------------------------------------------------------------------------- |
| `saveForm` | form       | Called when the save button is pressed. Will pass the form definition to the callback. |

### FormGrid

The FormGrid component can be used to render a list of forms with buttons to edit, view, delete, etc on each row.

#### Props

| Name       | Type           | Default                                            | Description                                                                                                            |
| ---------- | -------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `forms`    | array of forms | []                                                 | A list of forms to be rendered in the grid.                                                                            |
| `perms`    | object         | {view: true, edit: true, data: true, delete: true} | Whether or not to display buttons on the grid.                                                                         |
| `query`    | object         | {}                                                 | A query filter for passing to getForms when fetching forms.                                                            |
| `getForms` | function       | () => {}                                           | A function to trigger getting a new set of forms. Should accept the page number and filter query object as parameters. |

#### Event Props

| Name       | Parameters                   | Description                                                   |
| ---------- | ---------------------------- | ------------------------------------------------------------- |
| `onAction` | form: object, action: string | Called when the user clicks on a button on a row of the form. |

### SubmissionGrid

The submisison grid will render a list of submissions and allow clicking on one row to select it.

#### Props

| Name             | Type                 | Default  | Description                                                                                                                  |
| ---------------- | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `submissions`    | array of submissions | []       | A list of submissions to be rendered in the grid.                                                                            |
| `query`          | object               | {}       | A query filter for passing to getForms when fetching submissions.                                                            |
| `form`           | object               | {}       | The form definition for the submissions. This is used to render the submissions.                                             |
| `getSubmissions` | function             | () => {} | A function to trigger getting a new set of submissions. Should accept the page number and filter query object as parameters. |

#### Event Props

| Name       | Parameters                         | Description                                                         |
| ---------- | ---------------------------------- | ------------------------------------------------------------------- |
| `onAction` | submission: object, action: string | Called when the user clicks on a button on a row of the submission. |

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
