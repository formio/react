'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Content',
  render: function render() {
    return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.component.html } });
  }
});