'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Custom',
  mixins: [_componentMixin2.default],
  render: function render() {
    var value = this.props.data && this.props.data.hasOwnProperty(this.props.component.key) ? this.props.data[this.props.component.key] : '';
    return _react2.default.createElement(
      'div',
      { className: 'panel panel-default' },
      _react2.default.createElement(
        'div',
        { className: 'panel-body text-muted text-center' },
        'Custom Component (',
        this.props.component.type,
        ')'
      )
    );
  }
});