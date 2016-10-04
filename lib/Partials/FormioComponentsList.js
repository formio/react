'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioComponentsList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioComponents = require('./FormioComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormioComponentsList = exports.FormioComponentsList = _react2.default.createClass({
  displayName: 'FormioComponents',
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'formio-components' },
      this.props.components.map(function (component, index) {
        var key = component.key || component.type + index;
        var value = this.props.values && this.props.values.hasOwnProperty(component.key) ? this.props.values[component.key] : null;
        var FormioElement = _FormioComponents.FormioComponents.getComponent(component.type);
        if (this.props.checkConditional(component)) {
          return _react2.default.createElement(FormioElement, _extends({}, this.props, {
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