'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Textarea',
  mixins: [valueMixin, multiMixin],
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    return React.createElement('textarea', {
      className: 'form-control',
      key: index,
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      rows: this.props.component.rows,
      onChange: this.onChange
    });
  }
});