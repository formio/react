'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Textarea',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function(value, index) {
    return(
      React.createElement("textarea", {
        className: "form-control", 
        id: this.props.component.key, 
        "data-index": index, 
        name: this.props.name, 
        value: value, 
        disabled: this.props.readOnly, 
        placeholder: this.props.component.placeholder, 
        rows: this.props.component.rows, 
        onChange: this.onChange
      }
      )
    );
  }
});