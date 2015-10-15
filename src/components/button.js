'use strict'

var React = require('react');

// TODO: Support other button actions like reset.
module.exports = React.createClass({
  displayName: 'Button',
  render: function() {
    var classNames = "btn btn-" + this.props.component.theme + " btn-" + this.props.component.size;
    classNames += (this.props.component.block ? ' btn-block' : '');
    var leftIcon = (this.props.component.leftIcon ? <span className={this.props.component.leftIcon} aria-hidden="true"></span> : '');
    var rightIcon = (this.props.component.rightIcon ? <span className={this.props.component.rightIcon} aria-hidden="true"></span> : '');
    var disabled = this.props.isSubmitting || (this.props.component.disableOnInvalid && !this.props.isFormValid);
    var submitting = (this.props.isSubmitting && this.props.component.action == "submit" ? <i className="glyphicon glyphicon-refresh glyphicon-spin"></i> : '')
    return(
      <button
        className = {classNames}
        type={this.props.component.action == 'submit' ? 'submit' : 'button'}
        disabled={disabled}
      >
        {submitting}
        {leftIcon}
        {this.props.component.label}
        {rightIcon}
      </button>);
  }
});