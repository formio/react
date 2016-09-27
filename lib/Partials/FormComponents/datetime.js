'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _DateTimePicker = require('react-widgets/lib/DateTimePicker');

var _DateTimePicker2 = _interopRequireDefault(_DateTimePicker);

var _moment = require('react-widgets/lib/localizers/moment');

var _moment2 = _interopRequireDefault(_moment);

var _moment3 = require('moment');

var _moment4 = _interopRequireDefault(_moment3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _moment2.default)(_moment4.default);

module.exports = _react2.default.createClass({
  displayName: 'Datetime',
  mixins: [_valueMixin2.default, _multiMixin2.default],
  getInitialValue: function getInitialValue() {
    return null;
  },
  onChangeDatetime: function onChangeDatetime(index, value, str) {
    this.setValue(value, index);
  },
  getSingleElement: function getSingleElement(value, index) {
    return _react2.default.createElement(_DateTimePicker2.default, {
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      disabled: this.props.readOnly,
      calendar: this.props.component.enableDate,
      time: this.props.component.enableTime,
      placeholder: this.props.component.placeholder,
      value: value,
      onChange: this.onChangeDatetime.bind(null, index)
    });
  },
  getValueDisplay: function getValueDisplay(component, data) {
    // TODO: use the date formatter in component.format
    return data;
  }
});