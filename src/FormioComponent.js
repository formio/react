'use strict'

var React = require('react');

module.exports = React.createClass({
  displayName: 'FormioComponent',
  render: function() {
    // FormioComponents is a global variable so external scripts can define custom components.
    var FormioElement = FormioComponents[this.props.component.type];
    //console.log(this.props.component.type);
    return (
      <div className="form-group has-feedback form-field-type-{{ component.type }}" ng-class="{\'has-error\': formioFieldForm[component.key].$invalid && !formioFieldForm[component.key].$pristine }">
        <FormioElement
          name={this.props.component.key}
          {...this.props}
          />
      </div>
    );
  }
});