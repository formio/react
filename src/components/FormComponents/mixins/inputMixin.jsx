import React from 'react';
import MaskedInput from 'react-text-mask';
import { clone } from 'lodash';

module.exports = {
  customState: function(state) {
    state.hasChanges = false;
    return state;
  },
  onChangeInput: function(event) {
    var value = event.target.value;
    // Allow components to respond to onChange event.
    if (typeof this.onChangeCustom === 'function') {
      value = this.onChangeCustom(value);
    }
    var index = (this.props.component.multiple ? event.target.getAttribute('data-index') : null);
    this.setState(previousState => {
      if (index !== null && Array.isArray(previousState.value)) {
        // Clone so we keep state immutable.
        const newValue = clone(previousState.value);
        newValue[index] = value
        previousState.value = newValue;
      }
      else {
        previousState.value = value;
      }
      previousState.isPristine = false;
      previousState.hasChanges = true;
      Object.assign(previousState, this.validate(previousState.value));
      return previousState;
    });
  },
  onBlur: function(event) {
    if (typeof this.props.onChange === 'function' && this.state.hasChanges) {
      this.props.onChange(this);
      this.setState({
        hasChanges: false
      });
    }
  },
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
    const { component, name, readOnly } = this.props;
    const mask = component.inputMask || '';
    const properties = {
      type: component.inputType,
      key: index,
      className: 'form-control',
      id: component.key,
      'data-index': index,
      name: name,
      value: value,
      disabled: readOnly,
      placeholder: component.placeholder,
      onChange: this.onChangeInput,
      onBlur: this.onBlur,
      ref:  input => this.element = input
    };

    if (component.type === 'number') {
      properties.min = this.props.component.validate.min;
      properties.max = this.props.component.validate.max;
      properties.step = this.props.component.validate.step;
    }

    if (mask || component.type === 'currency') {
      properties.mask = this.getInputMask(mask);
      properties.placeholderChar = "_";
      properties.guide = true;
      return React.createElement(MaskedInput, properties);
    }
    else {
      return React.createElement('input', properties);
    }
  }
};
