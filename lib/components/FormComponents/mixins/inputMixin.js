'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTextMask = require('react-text-mask');

var _reactTextMask2 = _interopRequireDefault(_reactTextMask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  /**
   * Returns an input mask that is compatible with the input mask library.
   * @param {string} mask - The Form.io input mask.
   * @returns {Array} - The input mask for the mask library.
   */
  getInputMask: function getInputMask(mask) {
    if (typeof this.customMask === 'function') {
      return this.customMask;
    }
    if (!mask) {
      return false;
    }
    if (mask instanceof Array) {
      return mask;
    }
    var maskArray = [];
    for (var i = 0; i < mask.length; i++) {
      switch (mask[i]) {
        case '9':
          maskArray.push(/\d/);
          break;
        case 'a':
        case 'A':
          maskArray.push(/[a-zA-Z]/);
          break;
        case '*':
          maskArray.push(/[a-zA-Z0-9]/);
          break;
        default:
          maskArray.push(mask[i]);
          break;
      }
    }
    return maskArray;
  },
  getSingleElement: function getSingleElement(value, index) {
    var _this = this;

    index = index || 0;
    var mask = this.props.component.inputMask || '';
    return _react2.default.createElement(_reactTextMask2.default, {
      type: this.props.component.inputType,
      key: index,
      className: 'form-control',
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      mask: this.getInputMask(mask),
      placeholderChar: '_',
      guide: true,
      onChange: this.onChange,
      ref: function ref(input) {
        return _this.element = input;
      }
    });
  }
};