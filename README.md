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

## Form class

Give `Form` a `src` property and render:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {Form} from 'react-formio';
```

```javascript
ReactDOM.render(
  <Form src="https://example.form.io/example" />
  , document.getElementById('example')
);
```

See the src folder for all the available Props.

## FormBuilder class
The FormBuilder class can be used to embed a form builder directly in your react application. Please note that you'll need to include the CSS for the form builder from formio.js as well.

** For es6 import/export modules. **
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

See the src folder for all the available Props.

## License
Released under the [MIT License](http://www.opensource.org/licenses/MIT).
