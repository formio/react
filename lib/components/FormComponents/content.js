'use strict';

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
  displayName: 'Content',
  mixins: [_componentMixin2.default],
  render: function render() {
    var _props = this.props,
        component = _props.component,
        data = _props.data,
        row = _props.row;

    return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: _utils2.default.interpolate(this.props.component.html, {
          data: data,
          row: row,
          component: component
        }) } });
  }
});