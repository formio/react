import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';
import DateTimePicker from 'react-flatpickr';
import _get from 'lodash/get';

module.exports = React.createClass({
  displayName: 'Datetime',
  mixins: [valueMixin, multiMixin, componentMixin],
  getInitialValue: function() {
    return null;
  },
  convertFormat(format) {
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
  getConfig() {
    return {
      altInput: !this.props.readOnly,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      mode: this.props.component.multiple ? 'multiple' : 'single',
      enableTime: _get(this.props.component, 'enableTime', true),
      noCalendar: !_get(this.props.component, 'enableDate', true),
      altFormat: this.convertFormat(_get(this.props.component, 'format', '')),
      dateFormat: 'U',
      defaultDate: _get(this.props.component, 'defaultDate', ''),
      hourIncrement: _get(this.props.component, 'timePicker.hourStep', 1),
      minuteIncrement: _get(this.props.component, 'timePicker.minuteStep', 5),
      parseDate: date => {
        // On mobile with time only we will have a time string here and need to fix it.
        if (date.match(/^[0-1]?[0-9]:[0-5][0-9]$/)) {
          const parts = date.split(':');
          return new Date(new Date().setHours(parts[0], parts[1]));
        }
        return new Date(date);
      }
    };
  },
  onChangeDatetime: function(index, value) {
    // If this is a string it is an invalid datetime.
    if (value.length) {
      this.setValue(value[0].toISOString(), index);
    }
  },
  open: function() {
    // Flatpickr will automatically close when an external element is clicked such as the open button. Here we set
    // the open event on the next tick to go after the close event.
    setTimeout(() => {
      this.datepicker.flatpickr.open();
    }, 0);
  },
  getSingleElement: function(value, index) {
    const { component, name, readOnly } = this.props;
    return (
    [
      <DateTimePicker
        key="component"
        options={this.getConfig()}
        data-index={index}
        className="form-control"
        name = {name}
        disabled = {readOnly}
        placeholder = {component.placeholder}
        ref={(ref) => this.datepicker = ref}
        value={value}
        onChange={this.onChangeDatetime.bind(null, index)}
      />,
      <span className="input-group-btn" key="buttons">
        <button type="button" className="btn btn-default" onClick={this.open}>
          { component.enableDate ? <i className="glyphicon glyphicon-calendar" /> : <i className="glyphicon glyphicon-time" /> }
        </button>
      </span>
    ]
    );
  }
});
