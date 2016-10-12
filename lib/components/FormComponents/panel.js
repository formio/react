'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _components = require('../../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Panel',
  render: function render() {
    var title = this.props.component.title ? _react2.default.createElement(
      'div',
      { className: 'panel-heading' },
      _react2.default.createElement(
        'h3',
        { className: 'panel-title' },
        this.props.component.title
      )
    ) : '';
    var className = 'panel panel-' + this.props.component.theme + ' ' + (this.props.component.customClass ? this.props.component.customClass : '');
    return _react2.default.createElement(
      'div',
      { className: className },
      title,
      _react2.default.createElement(
        'div',
        { className: 'panel-body' },
        _react2.default.createElement(_components.FormioComponentsList, _extends({}, this.props, {
          components: this.props.component.components
        }))
      )
    );
  }
});