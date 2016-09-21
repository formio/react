'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var multiMixin = require('./mixins/multiMixin');
var DateTimePicker = require('react-widgets/lib/DateTimePicker');
var momentLocalizer = require('react-widgets/lib/localizers/moment');
var moment = require('moment');
momentLocalizer(moment);

module.exports = React.createClass({
  displayName: 'Datetime',
  mixins: [valueMixin, multiMixin],
  getInitialValue: function getInitialValue() {
    return null;
  },
  onChangeDatetime: function onChangeDatetime(index, value, str) {
    this.setValue(value, index);
  },
  getSingleElement: function getSingleElement(value, index) {
    return React.createElement(DateTimePicker, {
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
  }
});