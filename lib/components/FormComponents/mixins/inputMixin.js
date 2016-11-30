'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactInputMask = require('react-input-mask');

var _reactInputMask2 = _interopRequireDefault(_reactInputMask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  onChangeInput: function onChangeInput(event) {
    this.onChange(event, true);
  },
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    var mask = this.props.component.inputMask || '';
    return _react2.default.createElement(_reactInputMask2.default, {
      type: this.props.component.inputType,
      key: index,
      className: 'form-control',
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      mask: mask,
      onChange: this.onChangeInput
    });
  }
};