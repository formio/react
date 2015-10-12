'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var moment = require('moment');
var DateTimePicker = require('react-widgets/lib/DateTimePicker');
var momentLocalizer = require('react-widgets/lib/localizers/moment');
momentLocalizer(moment);

module.exports = React.createClass({
  displayName: 'Datetime',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function(value, index) {
    return(
      <DateTimePicker
        id={this.props.component.key}
        data-index={index}
        name={this.props.name}
        disabled={this.props.readOnly}
        placeholder={this.props.component.placeholder}
        value={value}
        onChange={this.setValue}
        />
    );
  }
});