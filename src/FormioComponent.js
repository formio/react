'use strict'

var React = require('react');

module.exports = React.createClass({
  displayName: 'FormioComponent',
  render: function() {
    // FormioComponents is a global variable so external scripts can define custom components.
    var FormioElement;
    if (FormioComponents[this.props.component.type]) {
      FormioElement = FormioComponents[this.props.component.type];
    }
    else {
      FormioElement = FormioComponents['custom'];
    }
    //console.log(this.props.component.type);
    var className = "form-group has-feedback form-field-type-" + this.props.component.type;
    if (typeof this.props.onElementRender === 'function') {
      this.props.onElementRender(this.props.component);
    }
    return (
      <div className={className}>
        <FormioElement
          name={this.props.component.key}
          {...this.props}
          />
      </div>
    );
  }
});