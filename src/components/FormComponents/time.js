import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';
import moment from 'moment';

module.exports = React.createClass({
  displayName: 'Time',
  mixins: [valueMixin, multiMixin, componentMixin],
  customState: function(state) {
    state.hourTime = moment(state.value, this.props.component.format).format('HH:mm:ss');
    return state;
  },
  willReceiveProps: function(nextProps) {
    this.setState(state => {
      state.hourTime = nextProps.value ? moment(nextProps.value, this.props.component.format).format('HH:mm:ss') : nextProps.value;
      return state;
    });
  },
  onChangeTime: function(event) {
    const value = event.target.value;
    const index = (this.props.component.multiple ? event.target.getAttribute('data-index') : null);
    this.setState(state => {
      state.hourTime = value;
      return state;
    }, this.setValue(value ? moment(value, 'HH:mm:ss').format(this.props.component.format) : value, index));
  },
  getSingleElement: function(value, index) {
    index = index || 0;
    const { component, name, readOnly } = this.props;
    const properties = {
      type: component.inputType,
      key: index,
      className: 'form-control',
      id: component.key,
      'data-index': index,
      name: name,
      value: this.state.hourTime,
      disabled: readOnly,
      placeholder: component.placeholder,
      onChange: this.onChangeTime,
      ref: input => this.element = input
    };

    return React.createElement('input', properties);
  }
});
