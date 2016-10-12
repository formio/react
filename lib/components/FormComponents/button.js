'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Support other button actions like reset.
module.exports = _react2.default.createClass({
  displayName: 'Button',
  onClick: function onClick(event) {
    switch (this.props.component.action) {
      case 'submit':
        // Allow default submit to continue.
        break;
      case 'reset':
        event.preventDefault();
        this.props.resetForm();
        break;
    }
  },
  render: function render() {
    var classNames = 'btn btn-' + this.props.component.theme + ' btn-' + this.props.component.size;
    classNames += (this.props.component.block ? ' btn-block' : '') + ' ' + (this.props.component.customClass ? this.props.component.customClass : '');
    var leftIcon = this.props.component.leftIcon ? _react2.default.createElement('span', { className: this.props.component.leftIcon, 'aria-hidden': 'true' }) : '';
    var rightIcon = this.props.component.rightIcon ? _react2.default.createElement('span', { className: this.props.component.rightIcon, 'aria-hidden': 'true' }) : '';
    var disabled = this.props.isSubmitting || this.props.component.disableOnInvalid && !this.props.isFormValid;
    var submitting = this.props.isSubmitting && this.props.component.action === 'submit' ? _react2.default.createElement('i', { className: 'glyphicon glyphicon-refresh glyphicon-spin' }) : '';
    return _react2.default.createElement(
      'button',
      {
        className: classNames,
        type: this.props.component.action === 'submit' ? 'submit' : 'button',
        disabled: disabled,
        onClick: this.onClick
      },
      submitting,
      leftIcon,
      this.props.component.label,
      rightIcon
    );
  }
});