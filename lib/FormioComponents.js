'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

module.exports = React.createClass({
  displayName: 'FormioComponents',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'formio-components' },
      this.props.components.map(function (component, index) {
        var key = component.key || component.type + index;
        var value = this.props.values && this.props.values.hasOwnProperty(component.key) ? this.props.values[component.key] : null;
        // FormioComponents is a global variable so external scripts can define custom components.
        var FormioElement;
        if (FormioComponents[component.type]) {
          FormioElement = FormioComponents[component.type];
        } else {
          FormioElement = FormioComponents['custom'];
        }
        if (this.props.checkConditional(component)) {
          return React.createElement(FormioElement, _extends({}, this.props, {
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