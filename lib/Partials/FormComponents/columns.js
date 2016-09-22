'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioComponentsList = require('../FormioComponentsList');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Column',
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'row' },
      this.props.component.columns.map(function (column, index) {
        return _react2.default.createElement(
          'div',
          { key: index, className: 'col-sm-6' },
          _react2.default.createElement(_FormioComponentsList.FormioComponentsList, _extends({}, this.props, {
            components: column.components
          }))
        );
      }.bind(this))
    );
  }
});