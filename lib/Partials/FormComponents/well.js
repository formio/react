'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioComponents = require('../FormioComponents');

var _FormioComponents2 = _interopRequireDefault(_FormioComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Well',
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'well' },
      _react2.default.createElement(_FormioComponents2.default, _extends({}, this.props, {
        components: this.props.component.components
      }))
    );
  }
});