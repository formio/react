'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var DateTimePicker = require('react-widgets/lib/DateTimePicker');
var momentLocalizer = require('react-widgets/lib/localizers/moment');
var moment = require('moment');
momentLocalizer(moment);

module.exports = React.createClass({
  displayName: 'Datetime',
  mixins: [componentMixin, multiMixin],
  onChangeDatetime: function(index, value, str) {
    this.setValue(value, index);
  },
  getSingleElement: function(value, index) {
    return(
      <DateTimePicker
        id={this.props.component.key}
        data-index={index}
        name={this.props.name}
        disabled={this.props.readOnly}
        calendar={this.props.component.enableDate}
        time={this.props.component.enableTime}
        placeholder={this.props.component.placeholder}
        value={value}
        onChange={this.onChangeDatetime.bind(null, index)}
        />
    );
  }
});