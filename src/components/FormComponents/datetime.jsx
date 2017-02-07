import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';
import DateTimePicker from 'react-datetime';
import moment from 'moment';

module.exports = React.createClass({
  displayName: 'Datetime',
  mixins: [valueMixin, multiMixin, componentMixin],
  getInitialValue: function() {
    return null;
  },
  onChangeDatetime: function(index, value) {
    // If this is a string it is an invalid datetime.
    if (value instanceof moment) {
      this.setValue(value.format(), index);
    }
  },
  isValidDate: function(currentDate, selectedDate) {
    // TODO: implement minDate and maxDate and other options.
    return true;
  },
  open: function() {
    this.datepicker.openCalendar();
  },
  getSingleElement: function(value, index) {
    const { component, name, readOnly } = this.props;
    return (
    <span>
      <DateTimePicker
        data-index={index}
        viewMode={component.datepickerMode + 's'}
        ref={(ref) => this.datepicker = ref}
        inputProps={{
          id: component.key,
          name: name,
          disabled: readOnly,
          placeholder: component.placeholder,
          className: "form-control"
        }}
        isValidDate={this.isValidDate}
        dateFormat={component.enableDate}
        timeFormat={component.enableTime}
        closeOnSelect={true}
        value={value}
        onChange={this.onChangeDatetime.bind(null, index)}
      />
      <span className="input-group-btn">
        <button type="button" className="btn btn-default" onClick={this.open}>
          { component.enableDate ? <i className="glyphicon glyphicon-calendar" /> : <i className="glyphicon glyphicon-time" /> }
        </button>
      </span>
    </span>
    );
  },
  getValueDisplay: function(component, data) {
    // TODO: use the date formatter in component.format
    return data;
  }
});
