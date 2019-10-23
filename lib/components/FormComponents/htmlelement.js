'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _utils = require('formiojs/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _createReactClass2.default)({
  displayName: 'HtmlElement',
  mixins: [_componentMixin2.default],
  render: function render(value, index) {
    var _props = this.props,
        component = _props.component,
        data = _props.data,
        row = _props.row;

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
        dangerouslySetInnerHTML: { __html: _utils2.default.interpolate(component.content, {
            data: data,
            row: row,
            component: component
          }) }
      }))
    );
  }
});