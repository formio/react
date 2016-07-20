'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

module.exports = React.createClass({
  displayName: 'FormioWizard',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'formio-wizard' },
      this.props.components.map(function (component, index) {
        var key = component.key || component.type + index;
        var value = this.props.values && this.props.values.hasOwnProperty(component.key) ? this.props.values[component.key] : component.defaultValue || '';
        // FormioComponents is a global variable so external scripts can define custom components.
        var FormioWizardElement;
        if (FormioComponents[component.type]) {
          FormioWizardElement = FormioComponents[component.type];
        } else {
          FormioWizardElement = FormioComponents['custom'];
        }
        if (this.props.checkConditional(component)) {
          return React.createElement(FormioWizardElement, _extends({}, this.props, {
            name: component.key,
            key: key,
            component: component,
            value: value
          }));
        } else {
          return null;
        }
      }.bind(this))
    );
  }
});