'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var FormioComponents = require('../FormioComponents');

module.exports = React.createClass({
  displayName: 'Container',
  mixins: [valueMixin],
  getInitialValue: function getInitialValue() {
    return {};
  },
  elementChange: function elementChange(component) {
    var value = this.state.value;
    value[component.props.component.key] = component.state.value;
    this.setState({
      value: value
    });
    this.props.onChange(this);
  },
  getElements: function getElements() {
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    return React.createElement(
      'div',
      { className: 'formio-container' },
      React.createElement(FormioComponents, _extends({}, this.props, {
        components: this.props.component.components,
        values: this.state.value,
        onChange: this.elementChange
      }))
    );
  }
});