import React from 'react';
import Input from 'react-text-mask';

module.exports = {
  /**
   * Returns an input mask that is compatible with the input mask library.
   * @param {string} mask - The Form.io input mask.
   * @returns {Array} - The input mask for the mask library.
   */
  getInputMask: function(mask) {
    if (typeof this.customMask === 'function') {
      return this.customMask;
    }
    if (!mask) {
      return false;
    }
    if (mask instanceof Array) {
      return mask;
    }
    let maskArray = [];
    for (let i=0; i < mask.length; i++) {
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
  getSingleElement: function(value, index) {
    index = index || 0;
    var mask = this.props.component.inputMask || '';
    return (
      <Input
        type={this.props.component.inputType}
        key={index}
        className='form-control'
        id={this.props.component.key}
        data-index={index}
        name={this.props.name}
        value={value}
        disabled={this.props.readOnly}
        placeholder={this.props.component.placeholder}
        mask={this.getInputMask(mask)}
        placeholderChar="_"
        guide={true}
        onChange={this.onChange}
        ref={ input => this.element = input }
        >
      </Input>
    );
  }
};
