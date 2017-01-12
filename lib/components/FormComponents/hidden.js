'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  mixins: [_valueMixin2.default, _componentMixin2.default],
  displayName: 'Hidden',
  getElements: function getElements() {
    var value = this.state && this.state.hasOwnProperty('value') ? this.state.value : '';
    return _react2.default.createElement('input', { type: 'hidden', id: this.props.component.key, name: this.props.component.key, value: value });
  }
});