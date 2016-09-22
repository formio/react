'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _FormioComponents = require('../FormioComponents');

var _FormioComponents2 = _interopRequireDefault(_FormioComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Container',
  mixins: [_valueMixin2.default],
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
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    return _react2.default.createElement(
      'div',
      { className: 'formio-container' },
      _react2.default.createElement(_FormioComponents2.default, _extends({}, this.props, {
        components: this.props.component.components,
        values: this.state.value,
        onChange: this.elementChange
      }))
    );
  }
});