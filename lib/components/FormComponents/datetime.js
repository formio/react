'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _reactFlatpickr = require('react-flatpickr');

var _reactFlatpickr2 = _interopRequireDefault(_reactFlatpickr);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Datetime',
  mixins: [_valueMixin2.default, _multiMixin2.default, _componentMixin2.default],
  getInitialValue: function getInitialValue() {
    return null;
  },
  convertFormat: function convertFormat(format) {
    // Year conversion.
    format = format.replace(/y/g, 'Y');
    format = format.replace('YYYY', 'Y');
    format = format.replace('YY', 'y');

    // Month conversion.
    format = format.replace('MMMM', 'F');
    format = format.replace(/M/g, 'n');
    format = format.replace('nnn', 'M');
    format = format.replace('nn', 'm');

    // Day in month.
    format = format.replace(/d/g, 'j');
    format = format.replace('jj', 'd');

    // Day in week.
    format = format.replace('EEEE', 'l');
    format = format.replace('EEE', 'D');

    // Hours, minutes, seconds
    format = format.replace('HH', 'H');
    format = format.replace('hh', 'h');
    format = format.replace('mm', 'i');
    format = format.replace('ss', 'S');
    format = format.replace(/a/g, 'K');
    format = format.replace(/A/g, 'K');
    return format;
  },
  getConfig: function getConfig() {
    return {
      altInput: !this.props.readOnly,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      mode: this.props.component.multiple ? 'multiple' : 'single',
      enableTime: (0, _get3.default)(this.props.component, 'enableTime', true),
      noCalendar: !(0, _get3.default)(this.props.component, 'enableDate', true),
      altFormat: this.convertFormat((0, _get3.default)(this.props.component, 'format', '')),
      dateFormat: 'U',
      defaultDate: (0, _get3.default)(this.props.component, 'defaultDate', ''),
      hourIncrement: (0, _get3.default)(this.props.component, 'timePicker.hourStep', 1),
      minuteIncrement: (0, _get3.default)(this.props.component, 'timePicker.minuteStep', 5),
      parseDate: function parseDate(date) {
        // On mobile with time only we will have a time string here and need to fix it.
        if (date.match(/^[0-1]?[0-9]:[0-5][0-9]$/)) {
          var parts = date.split(':');
          return new Date(new Date().setHours(parts[0], parts[1]));
        }
        return new Date(date);
      }
    };
  },

  onChangeDatetime: function onChangeDatetime(index, value) {
    // If this is a string it is an invalid datetime.
    if (value.length) {
      this.setValue(value[0].toISOString(), index);
    }
  },
  open: function open() {
    var _this = this;

    // Flatpickr will automatically close when an external element is clicked such as the open button. Here we set
    // the open event on the next tick to go after the close event.
    setTimeout(function () {
      _this.datepicker.flatpickr.open();
    }, 0);
  },
  getSingleElement: function getSingleElement(value, index) {
    var _this2 = this;

    var _props = this.props,
        component = _props.component,
        name = _props.name,
        readOnly = _props.readOnly;

    return [_react2.default.createElement(_reactFlatpickr2.default, {
      key: 'component',
      options: this.getConfig(),
      'data-index': index,
      className: 'form-control',
      name: name,
      disabled: readOnly,
      placeholder: component.placeholder,
      ref: function ref(_ref) {
        return _this2.datepicker = _ref;
      },
      value: value,
      onChange: this.onChangeDatetime.bind(null, index)
    }), _react2.default.createElement(
      'span',
      { className: 'input-group-btn', key: 'buttons' },
      _react2.default.createElement(
        'button',
        { type: 'button', className: 'btn btn-default', onClick: this.open },
        component.enableDate ? _react2.default.createElement('i', { className: 'glyphicon glyphicon-calendar' }) : _react2.default.createElement('i', { className: 'glyphicon glyphicon-time' })
      )
    )];
  }
});