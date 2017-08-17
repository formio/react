'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _components = require('../../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Column',
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'row' },
      this.props.component.columns.map(function (column, index) {
        var classes = 'col-sm-' + (column.width || 6) + (column.offset ? ' col-sm-offset-' + column.offset : '') + (column.push ? ' col-sm-push-' + column.push : '') + (column.pull ? ' col-sm-pull-' + column.pull : '');
        return _react2.default.createElement(
          'div',
          { key: index, className: classes },
          _react2.default.createElement(_components.FormioComponentsList, _extends({}, this.props, {
            components: column.components
          }))
        );
      }.bind(this))
    );
  }
});