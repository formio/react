'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Checkbox',
  mixins: [componentMixin, multiMixin],
  onChangeCheckbox: function(event) {
    var value = event.currentTarget.checked;
    var index = (this.props.component.multiple ? event.currentTarget.getAttribute('data-index') : null);
    this.setValue(value, index);
  },
  getSingleElement: function(value, index) {
    index = index || 0;
    var required = (this.props.component.validate.required ? 'field-required' : '');
    return(
      React.createElement("div", {className: "checkbox"}, 
        React.createElement("label", {className: required}, 
          React.createElement("input", {
            type: "checkbox", 
            id: this.props.component.key, 
            "data-index": index, 
            name: this.props.name, 
            checked: value, 
            disabled: this.props.readOnly, 
            onChange: this.onChangeCheckbox}
          ), this.props.component.label
        )
      )
    );
  }
});