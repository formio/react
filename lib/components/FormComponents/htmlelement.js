'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'HtmlElement',
  mixins: [_componentMixin2.default],
  render: function render(value, index) {
    var component = this.props.component;

    var attrs = component.attrs.reduce(function (prev, item) {
      if (item.attr) {
        prev[item.attr] = item.value;
      }
      return prev;
    }, {});
    return _react2.default.createElement(
      'div',
      { className: 'formio-field-type-htmlelement' },
      _react2.default.createElement(component.tag, _extends({
        className: component.customClass
      }, attrs, {
        dangerouslySetInnerHTML: { __html: component.content }
      }))
    );
  }
});