'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _reactDatetime = require('react-datetime');

var _reactDatetime2 = _interopRequireDefault(_reactDatetime);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Datetime',
  mixins: [_valueMixin2.default, _multiMixin2.default, _componentMixin2.default],
  getInitialValue: function getInitialValue() {
    return null;
  },
  onChangeDatetime: function onChangeDatetime(index, value) {
    // If this is a string it is an invalid datetime.
    if (value instanceof _moment2.default) {
      this.setValue(value.format(), index);
    }
  },
  isValidDate: function isValidDate(currentDate, selectedDate) {
    // TODO: implement minDate and maxDate and other options.
    return true;
  },
  open: function open() {
    this.datepicker.openCalendar();
  },
  getSingleElement: function getSingleElement(value, index) {
    var _this = this;

    var _props = this.props,
        component = _props.component,
        name = _props.name,
        readOnly = _props.readOnly;

    return [_react2.default.createElement(_reactDatetime2.default, {
      'data-index': index,
      viewMode: component.datepickerMode + 's',
      ref: function ref(_ref) {
        return _this.datepicker = _ref;
      },
      inputProps: {
        id: component.key,
        name: name,
        disabled: readOnly,
        placeholder: component.placeholder,
        className: "form-control"
      },
      isValidDate: this.isValidDate,
      dateFormat: component.enableDate,
      timeFormat: component.enableTime,
      closeOnSelect: true,
      value: value,
      onChange: this.onChangeDatetime.bind(null, index)
    }), _react2.default.createElement(
      'span',
      { className: 'input-group-btn' },
      _react2.default.createElement(
        'button',
        { type: 'button', className: 'btn btn-default', onClick: this.open },
        component.enableDate ? _react2.default.createElement('i', { className: 'glyphicon glyphicon-calendar' }) : _react2.default.createElement('i', { className: 'glyphicon glyphicon-time' })
      )
    )];
  },
  getValueDisplay: function getValueDisplay(component, data) {
    // TODO: use the date formatter in component.format
    return data;
  }
});