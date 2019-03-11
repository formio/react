# React Formio

A [React](http://facebook.github.io/react/) library for rendering out forms based on the [Form.io](https://www.form.io) platform.

## Example Application
To see an example application of how to implement all the components and modules in this library, see [https://github.com/formio/react-app-starterkit](https://github.com/formio/react-app-starterkit)

## Install

### npm

`react-formio` can be used on the server, or bundled for the client using an
npm-compatible packaging system such as [Browserify](http://browserify.org/) or
[webpack](http://webpack.github.io/).

```
npm install react-formio --save
```

## Components

### Form

The form component is the primary component of the system. It is what takes the form definition (json) and renders the form into html. There are multiple ways to send the form to the Form component. The two main ways are to pass the ```src``` prop with a url to the form definition, usually a form.io server. The other is to pass the   ```form``` prop with the json definition and optionally a ```url``` prop with the location of the form.

#### Props

| Name | Type | Default | Description |
|---|---|---|---|
| ```src```  | url  |   | The url of the form definition. This is commonly from a form.io server. When using src, the form will automatically submit the data to that url as well.  |
| ```url``` | url  |   | The url of the form definition. The form will not be loaded from this url and the submission will not be saved here either. This is used for file upload, oauth and other components or actions that need to know where the server is. Use this in connection with ```form```  |
| ```form``` | object |   | Instead of loading a form from the ```src``` url, you can preload the form definition and pass it in with the ```form``` prop. You should also set ```url``` if you are using any advanced components like file upload or oauth. |
| ```submission``` | object | | Submission data to fill the form. You can either load a previous submission or create a submission with some pre-filled data. If you do not provide a submissions the form will initialize an empty submission using default values from the form. |
| ```options``` | object | | an options object that can pass options to the formio.js Form that is rendered. You can set options such as ```readOnly```, ```noAlerts``` or ```hide```. There are many options to be found in the formio.js library. |

#### Event Props

You can respond to various events in the form. Simply pass in a prop with a function for one of these events.

| Name | Parameters | Description |
|---|---|---|
| ```onSubmit```  | ```submission```: object | When the submit button is pressed and the submission has started. If ```src``` is not provided, this will be the final submit event.|
| ```onSubmitDone``` | ```submission```: object | When the submission has successfully been made to the server. This will only fire if ```src``` is set. |
| ```onChange``` | ```submission```: object, ```submission.changed```: object of what changed, ```submission.isValid```: boolean - if the submission passes validations. | A value in the submission has changed. |
| ```onError``` | ```errors```: array or string or boolean | Called when an error occurs during submission such as a validation issue. |
| ```onRender``` | | Triggers when the form is finished rendering. |
| ```onCustomEvent``` | { ```type```: string - event type, ```component```: object - triggering component, ```data```: object - data for component, ```event```: string - raw event } | Event that is triggered from a button configured with "Event" type. | 
| ```onPrevPage``` | { ```page```: integer - new page number, ```submission```: object - submission data } | Triggered for wizards when "Previous" button is pressed |
 ```onNextPage``` | { ```page```: integer - new page number, ```submission```: object - submission data } | Triggered for wizards when "Next" button is pressed |

#### Example

Give `Form` a `src` property and render:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'react-formio';
```

```javascript
ReactDOM.render(
  <Form src="https://example.form.io/example" onSubmit={console.log} />
  , document.getElementById('example')
);
```

### FormBuilder
The FormBuilder class can be used to embed a form builder directly in your react application. Please note that you'll need to include the CSS for the form builder from formio.js as well.

Please note that the FormBuilder component does not load and save from/to a url. You must handle the form definition loading and saving yourself or use the FormEdit component.

#### Props

| Name | Type | Default | Description |
|---|---|---|---|
| ```form``` | object |   | This is the form definition object. It should at least have a ```display``` property set to form, wizard or pdf. |
| ```options``` | object | | an options object that can pass options to the formio.js Form that is rendered. There are many options to be found in the formio.js library. |

#### Event Props

| Name | Parameters | Description |
|---|---|---|
| ```onChange```  | ```schema```: object | Triggered any time the form definition changes |
| ```onEditComponent``` | ```component```: object | Triggered when the component settings dialog is opened |
| ```onSaveComponent``` | ```component```: object | Triggered when the component settings dialog is saved and closed |
| ```onCancelComponent``` | ```component```: object | Triggered when the component settings dialog is cancelled |
| ```onDeleteComponent``` | ```component```: object | Triggered when a component is removed from the form |
| ```updateComponent``` | ```component```: object | Triggered when a component is added or moved in the form |


#### Example
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {FormBuilder} from 'react-formio';
```

```javascript
ReactDOM.render(
  <FormBuilder form={{display: 'form'}} onChange={(schema) => console.log(schema)} />
  , document.getElementById('builder')
);
```

### Errors
Documentation coming soon

### FormEdit
Documentation coming soon

### FormGrid
Documentation coming soon

### Grid
Documentation coming soon

### Pagination
Documentation coming soon

### SubmissionGrid
Documentation coming soon

## Modules
Modules contain Redux actions, reducers, constants and selectors to simplify the API requests made for form.io forms.

### auth
Documentation coming soon

### form
Documentation coming soon

### forms
Documentation coming soon

### root
Documentation coming soon

### submission
Documentation coming soon

### submissions
Documentation coming soon

## License
Released under the [MIT License](http://www.opensource.org/licenses/MIT).
