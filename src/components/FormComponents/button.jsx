import React from 'react';
import componentMixin from './mixins/componentMixin';

// TODO: Support other button actions like reset.
module.exports = React.createClass({
  displayName: 'Button',
  mixins: [componentMixin],
  getButtonType: function() {
    switch (this.props.component.action) {
      case 'submit':
        return 'submit';
      case 'reset':
        return 'reset';
      case 'event':
      case 'oauth':
      default:
        return 'button';
    }
  },
  onClick: function(event) {
    if (this.props.readOnly) {
      event.preventDefault();
      this.props.resetForm();
      return;
    }
    switch (this.props.component.action) {
      case 'submit':
        // Allow default submit to continue.
        break;
      case 'event':
        this.props.onEvent(this.props.component.event);
        break;
      case 'oauth':
        /* eslint-disable no-console */
        console.warning('OAuth not yet implemented. Please contact support.');
        /* eslint-enable no-console */
        break;
      case 'reset':
        event.preventDefault();
        this.props.resetForm();
        break;
    }
  },
  render: function() {
    var classNames = 'btn btn-' + this.props.component.theme + ' btn-' + this.props.component.size;
    classNames += (this.props.component.block ? ' btn-block' : '') + ' ' + (this.props.component.customClass ? this.props.component.customClass : '');
    classNames += (this.props.readOnly ? ' disabled' : '');
    var leftIcon = (this.props.component.leftIcon ? <span className={this.props.component.leftIcon} aria-hidden='true'></span> : '');
    var rightIcon = (this.props.component.rightIcon ? <span className={this.props.component.rightIcon} aria-hidden='true'></span> : '');
    var disabled = this.props.isSubmitting || (this.props.component.disableOnInvalid && !this.props.isFormValid);
    var submitting = (this.props.isSubmitting && this.props.component.action === 'submit' ? <i className='glyphicon glyphicon-refresh glyphicon-spin'></i> : '');
    return (
      <button
        className={classNames}
        type={this.getButtonType()}
        disabled={disabled}
        onClick={this.onClick}
      >
        {submitting}
        {leftIcon}
        {this.props.component.label}
        {rightIcon}
      </button>
    );
  }
});
