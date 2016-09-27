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
    return this.parseMomentValue(
      this.props.value
    );
  },
  parseMomentValue(val) {
    if(this.props.value.length === 0 ||
      this.props.value.toLowerCase().indexOf('moment') === -1) return new Date();

    try {
      return new Date(eval(
        val.toLowerCase()
      ));
    } catch(e) {}
    return new Date(val);
  },
  onChangeDatetime: function(index, value, str) {
    this.setValue(
      this.parseMomentValue(value),
      index
    );
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
  }
});
