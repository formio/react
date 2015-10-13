
var React = require('react');
var Formio = require('./Formio');

React.render(
  <Formio
    src="https://randall.form.io/test"
/*    form=""
    submission=""
    onFormSubmit=""
    onFormLoad=""
    onSubmissionLoad=""
    onElementRender=""
    onFormError=""*/
    />
  , document.getElementById('formio')
);