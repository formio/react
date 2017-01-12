'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Content',
  mixins: [_componentMixin2.default],
  render: function render() {
    return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.component.html } });
  }
});