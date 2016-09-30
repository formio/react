import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import moment from 'moment';
momentLocalizer(moment);

module.exports = React.createClass({
  displayName: 'Datetime',
  mixins: [valueMixin, multiMixin],
  getInitialValue: function() {
    return null;
  },
  onChangeDatetime: function(index, value, str) {
    this.setValue(value, index);
  },
  getSingleElement: function(value, index) {
    return (
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
  },
  getValueDisplay: function(component, data) {
    // TODO: use the date formatter in component.format
    return data;
  }
});
