# React Formio

A [React](http://facebook.github.io/react/) component for rendering out forms based on the [Form.io](https://www.form.io) platform.

## Install

### npm

`React Formio` can be used on the server, or bundled for the client using an
npm-compatible packaging system such as [Browserify](http://browserify.org/) or
[webpack](http://webpack.github.io/).

```
npm install react-formio --save
```

### Browser bundle

The browser bundle exposes a global `Formio` variable and expects to find
a global `React` variable to work with.

You can find it in the [/dist directory](https://github.com/formio/react-formio/tree/master/dist/build).

## Usage

Give `Formio` a `src` property and render:

```javascript
var React = require('react');
var Formio = require('react-formio');

// React <= 0.13
React.render(
  <Formio src="https://example.formio/example" />
  , document.getElementById('example')
);

// React >= 0.14
var ReactDOM = require('react-dom');

ReactDOM.render(
  <Formio src="https://example.formio/example" />
  , document.getElementById('example')
);
```

## Props

### `src` : `string`

The form API source from [form.io](https://www.form.io) or your custom formio server.

See the [Creating a form](http://help.form.io/userguide/#new-form)
for where to set the API Path for your form.

You can also pass in the submission url as the `src` and the form will render with the data populated from the submission.

### `form` : `object`

An object representing the form. Use this instead of src for custom forms. 

**Note:** `src` will override this property if used.

### `submission`: `Object`

An object representing the default data for the form.

**Note:** `src` ill override this if a submission url is entered.

### `onFormSubmit` : `(submission: object)`

A function callback that will be called when a submission is successful.

### `onFormError` : `(response: object)`

A function callback that will be called when a submisison is unsuccessful.

### `onFormLoad` : `(form: object)`

A function callback that will be called with a form is finished loading.

### `onSubmissionLoad` : `(submission: object)`

A function callback that will be called after a submission is loaded.

### `onElementRender` : `(element: object)`

A function callback that will be called each time a component is rendered.

## License
Released under the [MIT License](http://www.opensource.org/licenses/MIT).