'use strict'

var React = require('react');

// TODO: Support other button actions like reset.
module.exports = React.createClass({
  displayName: 'Button',
  onClick: function(event) {
    switch(this.props.component.action) {
      case 'submit':
        // Allow default submit to continue.
        break;
      case 'reset':
        event.preventDefault();
        this.props.resetForm();
        break;
    }
  },
  render: function() {
    var classNames = "btn btn-" + this.props.component.theme + " btn-" + this.props.component.size;
    classNames += (this.props.component.block ? ' btn-block' : '');
    var leftIcon = (this.props.component.leftIcon ? React.createElement("span", {className: this.props.component.leftIcon, "aria-hidden": "true"}) : '');
    var rightIcon = (this.props.component.rightIcon ? React.createElement("span", {className: this.props.component.rightIcon, "aria-hidden": "true"}) : '');
    var disabled = this.props.isSubmitting || (this.props.component.disableOnInvalid && !this.props.isFormValid);
    var submitting = (this.props.isSubmitting && this.props.component.action == "submit" ? React.createElement("i", {className: "glyphicon glyphicon-refresh glyphicon-spin"}) : '')
    return(
      React.createElement("button", {
        className: classNames, 
        type: this.props.component.action == 'submit' ? 'submit' : 'button', 
        disabled: disabled, 
        onClick: this.onClick
      }, 
        submitting, 
        leftIcon, 
        this.props.component.label, 
        rightIcon
      ));
  }
});