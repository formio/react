import React from 'react';
import { deepEqual } from '../../../util';
import { clone, debounce } from 'lodash';

module.exports = {
  getDefaultValue: function(value) {
    const { component, data, row } = this.props;
    // Allow components to set different default values.
    if (value == null) {
      if (component.hasOwnProperty('customDefaultValue')) {
        try {
          value = eval('(function(data, row) { var value = "";' + component.customDefaultValue.toString() + '; return value; })(data, row)');
        }
        catch (e) {
          /* eslint-disable no-console */
          console.warn('An error occurrend in a custom default value in ' + component.key, e);
          /* eslint-enable no-console */
          value = '';
        }
      }
      else if (component.hasOwnProperty('defaultValue')) {
        value = component.defaultValue;
        if (typeof this.onChangeCustom === 'function') {
          value = this.onChangeCustom(value);
        }
      }
      else if (typeof this.getInitialValue === 'function') {
        value = this.getInitialValue();
      }
      else {
        value = '';
      }
    }
    value = this.safeSingleToMultiple(value);
    return value;
  },
  getInitialState: function() {
    const value = this.getDefaultValue(this.props.value);
    const valid = this.validate(value);
    let state = {
      value: value,
      isValid: valid.isValid,
      errorMessage: valid.errorMessage,
      isPristine: true
    };
    if (typeof this.customState === 'function') {
      state = this.customState(state);
    }
    // ComponentWillReceiveProps isn't working without this as the reference to the data already is updated.
    this.data = {};
    return state;
  },
  validate: function(value) {
    const { component } = this.props;
    // Allow components to have custom validation.
    if (typeof this.validateCustom === 'function') {
      return this.validateCustom(value);
    }
    var state = {
      isValid: true,
      errorMessage: ''
    };
    // Validate each item if multiple.
    if (component.multiple) {
      value.forEach(function(item) {
        if (state.isValid) {
          state = this.validateItem(item);
        }
      }.bind(this));
      /* eslint-disable no-console */
      if (component.validate && component.validate.required && (!value instanceof Array || value.length === 0)) {
        state.isValid = false;
        state.errorMessage = (component.label || component.key) + ' is required.';
      }
    }
    else {
      state = this.validateItem(value);
    }
    return state;
  },
  validateItem: function(item) {
    const { component } = this.props;

    var state = {
      isValid: true,
      errorMessage: ''
    };
    // Check for no validation criteria
    if (!component.validate) {
      return state;
    }
    // Required
    if (component.validate.required) {
      // Multivalue and selectboxes are exceptions since !![] === true and !!{} === true.
      if (component.type === 'selectboxes' && !Object.keys(item).reduce(function(prev, cur) {  return prev || item[cur];}, false)) {
        state.isValid = false;
        state.errorMessage = (component.label || component.key) + ' is required.';
      }
      else if (!item) {
        state.isValid = false;
        state.errorMessage = (component.label || component.key) + ' is required.';
      }
    }
    // Email
    if (state.isValid && component.type === 'email' && !item.match(/\S+@\S+/)) {
      state.isValid = false;
      state.errorMessage = (component.label || component.key) + ' must be a valid email.';
    }
    // MaxLength
    if (state.isValid && component.validate.maxLength && item.length > component.validate.maxLength) {
      state.isValid = false;
      state.errorMessage = (component.label || component.key) + ' cannot be longer than ' + (component.validate.maxLength) + ' characters.';
    }
    // MinLength
    if (state.isValid && component.validate.minLength && item.length < component.validate.minLength) {
      state.isValid = false;
      state.errorMessage = (component.label || component.key) + ' cannot be shorter than ' + (component.validate.minLength) + ' characters.';
    }
    // MaxValue
    if (state.isValid && component.validate.max && item > component.validate.max) {
      state.isValid = false;
      state.errorMessage = (component.label || component.key) + ' cannot be greater than ' + component.validate.max;
    }
    // MinValue
    if (state.isValid && component.validate.min && item < component.validate.min) {
      state.isValid = false;
      state.errorMessage = (component.label || component.key) + ' cannot be less than ' + component.validate.min;
    }
    // Regex
    if (state.isValid && component.validate.pattern) {
      var re = new RegExp(component.validate.pattern, 'g');
      state.isValid = item.match(re);
      if (!state.isValid) {
        state.errorMessage = (component.label || component.key) + ' must match the expression: ' + component.validate.pattern;
      }
    }
    // Input Mask
    if (this.element && component.inputMask && this.state.value && this.state.value.includes(this.element.maskChar)) {
      state.isValid = false;
      state.errorMessage = (component.label || component.key) + ' must use the format ' + component.inputMask;
    }
    // Custom
    if (state.isValid && component.validate.custom) {
      var custom = component.validate.custom;
      custom = custom.replace(/({{\s+(.*)\s+}})/, function(match, $1, $2) {
        return this.props.data[$2];
      }.bind(this));
      var input = item;
      var valid;
      try {
        const { data, row } = this.props;
        valid = eval(custom);
        state.isValid = (valid === true);
      }
      catch (e) {
        /* eslint-disable no-console */
        console.warn('A syntax error occurred while computing custom values in ' + component.key, e);
        /* eslint-enable no-console */
      }
      if (!state.isValid) {
        state.errorMessage = valid || ((component.label || component.key) + 'is not a valid value.');
      }
    }
    return state;
  },
  componentWillReceiveProps: function(nextProps) {
    const { component } = this.props;
    let value;
    if (component.hasOwnProperty('calculateValue') && component.calculateValue) {
      if (!deepEqual(this.data, nextProps.data)) {
        this.data = clone(nextProps.data);
        try {
          const result = eval('(function(data, row) { var value = [];' + component.calculateValue.toString() + '; return value; })(this.data, nextProps.row)');
          if (this.state.value != result) {
            this.setValue(result);
          }
        }
        catch (e) {
          /* eslint-disable no-console */
          console.warn('An error occurred calculating a value for ' + component.key, e);
          /* eslint-enable no-console */
        }
      }
    }
    if (this.props.value !== nextProps.value) {
      value = this.safeSingleToMultiple(nextProps.value);
    }
    if (typeof value !== 'undefined' && value !== null) {
      var valid = this.validate(value);
      this.setState({
        value: value,
        isValid: valid.isValid,
        errorMessage: valid.errorMessage
      });
    }
    if (typeof this.willReceiveProps === 'function') {
      this.willReceiveProps(nextProps);
    }
  },
  safeSingleToMultiple: function(value) {
    const { component } = this.props;
    // Don't do anything to datagrid or containers.
    if ((component.type === 'datagrid') || (component.type === 'container')) {
      return value;
    }
    // If this was a single but is not a multivalue.
    if (component.multiple && !Array.isArray(value)) {
      if(component.type === 'select' && !value) {
        value = [];
      }
      else {
        value = [value];
      }
    }
    // If this was a multivalue but is now single value.
    // RE-60 :-Need to return the value as array of object instead of object while converting  a multivalue to single value for datagrid component
    else if (!component.multiple && Array.isArray(value)) {
      value = value[0];
    }
    // Set dates to Date object.
    if (component.type === 'datetime' && value && !(value instanceof Date)) {
      value = new Date(value);
    }
    return value;
  },
  componentWillMount: function() {
    this.unmounting = false;
    if (!this.props.options || !this.props.options.hasOwnProperty('skipInit') || !this.props.options.skipInit) {
      this.setValue(this.state.value, null, true);
    }
    if (typeof this.props.attachToForm === 'function') {
      this.props.attachToForm(this);
    }
  },
  componentWillUnmount: function() {
    this.unmounting = true;
    if (typeof this.props.attachToForm === 'function') {
      this.props.detachFromForm(this);
    }
  },
  onChange: function(event) {
    var value = event.target.value;
    // Allow components to respond to onChange event.
    if (typeof this.onChangeCustom === 'function') {
      value = this.onChangeCustom(value);
    }
    var index = (this.props.component.multiple ? event.target.getAttribute('data-index') : null);
    this.setValue(value, index);
  },
  setValue: function(value, index, pristine) {
    if (index === undefined) {
      index = null;
    }
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
      previousState.isPristine = !!pristine;
      Object.assign(previousState, this.validate(previousState.value));
      return previousState;
    }, () => {
      if (typeof this.props.onChange === 'function') {
        if (!this.state.isPristine || this.props.value !== this.state.value) {
          this.props.onChange(this);
        }
      }
    });
  },
  getComponent: function() {
    var id = 'form-group-' + this.props.component.key;
    var classNames = 'form-group form-field-type-' + this.props.component.type + ' ' + id + (this.state.errorMessage !== '' && !this.state.isPristine ? ' has-error': '') + (this.props.component.customClass ? ' ' + this.props.component.customClass : '');
    var Elements = this.getElements();
    var Error = (this.state.errorMessage && !this.state.isPristine ? <p className='help-block'>{this.state.errorMessage}</p> : '');
    return (
      <div className={classNames} id={id}>
        {Elements}
        {Error}
      </div>
    );
  },
  render: function() {
    var element = this.getComponent();
    if (typeof this.props.onElementRender === 'function') {
      element = this.props.onElementRender(this, element);
    }
    return element;
  },
  getDisplay: function(component, value) {
    if (typeof this.getValueDisplay === 'function') {
      if (Array.isArray(value) && component.multiple && component.type !== 'file') {
        return value.map(this.getValueDisplay.bind(null, component)).join(', ');
      }
      else {
        return this.getValueDisplay(component, value);
      }
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    // If this is still an object, something went wrong and we don't know what to do with it.
    if (typeof value === 'object') {
      return '[object Object]';
    }
    return value;
  }
};
