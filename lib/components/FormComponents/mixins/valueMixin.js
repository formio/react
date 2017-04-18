'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('../../../util');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  getDefaultValue: function getDefaultValue(value) {
    var _props = this.props,
        component = _props.component,
        data = _props.data,
        row = _props.row;
    // Allow components to set different default values.

    if (value == null) {
      if (component.hasOwnProperty('customDefaultValue')) {
        try {
          value = eval('(function(data, row) { var value = "";' + component.customDefaultValue.toString() + '; return value; })(data, row)');
        } catch (e) {
          /* eslint-disable no-console */
          console.warn('An error occurrend in a custom default value in ' + component.key, e);
          /* eslint-enable no-console */
          value = '';
        }
      } else if (component.hasOwnProperty('defaultValue')) {
        value = component.defaultValue;
        if (typeof this.onChangeCustom === 'function') {
          value = this.onChangeCustom(value);
        }
      } else if (typeof this.getInitialValue === 'function') {
        value = this.getInitialValue();
      } else {
        value = '';
      }
    }
    value = this.safeSingleToMultiple(value);
    return value;
  },
  getInitialState: function getInitialState() {
    var value = this.getDefaultValue(this.props.value);
    var valid = this.validate(value);
    var state = {
      value: value,
      isValid: valid.isValid,
      errorType: valid.errorType,
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
  validate: function validate(value) {
    var _this = this;

    var component = this.props.component;
    // Allow components to have custom validation.

    if (typeof this.validateCustom === 'function') {
      return this.validateCustom(value);
    }
    var state = {
      isValid: true,
      errorType: '',
      errorMessage: ''
    };
    // Validate each item if multiple.
    if (component.multiple) {
      value.forEach(function (item) {
        if (state.isValid) {
          state = _this.validateItem(item);
        }
      });

      if (component.validate && component.validate.required && (!value instanceof Array || value.length === 0)) {
        state.isValid = false;
        state.errorType = 'required';
        state.errorMessage = (component.label || component.key) + ' is required.';
      }
    } else {
      state = this.validateItem(value);
    }
    return state;
  },
  validateItem: function validateItem(item) {
    var component = this.props.component;


    var state = {
      isValid: true,
      errorType: '',
      errorMessage: ''
    };
    // Check for no validation criteria
    if (!component.validate) {
      return state;
    }
    // Required
    if (component.validate.required) {
      // Multivalue and selectboxes are exceptions since !![] === true and !!{} === true.
      if (component.type === 'selectboxes' && !Object.keys(item).reduce(function (prev, cur) {
        return prev || item[cur];
      }, false)) {
        state.isValid = false;
        state.errorType = 'required';
        state.errorMessage = (component.label || component.key) + ' is required.';
      } else if (!item) {
        state.isValid = false;
        state.errorType = 'required';
        state.errorMessage = (component.label || component.key) + ' is required.';
      }
    }
    // Email
    if (state.isValid && component.type === 'email' && !item.match(/\S+@\S+/)) {
      state.isValid = false;
      state.errorType = 'email';
      state.errorMessage = (component.label || component.key) + ' must be a valid email.';
    }
    // MaxLength
    if (state.isValid && component.validate.maxLength && item.length > component.validate.maxLength) {
      state.isValid = false;
      state.errorType = 'maxlength';
      state.errorMessage = (component.label || component.key) + ' cannot be longer than ' + component.validate.maxLength + ' characters.';
    }
    // MinLength
    if (state.isValid && component.validate.minLength && item.length < component.validate.minLength) {
      state.isValid = false;
      state.errorType = 'minlength';
      state.errorMessage = (component.label || component.key) + ' cannot be shorter than ' + component.validate.minLength + ' characters.';
    }
    // MaxValue
    if (state.isValid && component.validate.max && item > component.validate.max) {
      state.isValid = false;
      state.errorType = 'max';
      state.errorMessage = (component.label || component.key) + ' cannot be greater than ' + component.validate.max;
    }
    // MinValue
    if (state.isValid && component.validate.min && item < component.validate.min) {
      state.isValid = false;
      state.errorType = 'min';
      state.errorMessage = (component.label || component.key) + ' cannot be less than ' + component.validate.min;
    }
    // Regex
    if (state.isValid && component.validate.pattern) {
      var re = new RegExp(component.validate.pattern, 'g');
      state.isValid = item.match(re);
      if (!state.isValid) {
        state.errorType = 'regex';
        state.errorMessage = (component.label || component.key) + ' must match the expression: ' + component.validate.pattern;
      }
    }
    // Input Mask
    if (this.element && component.inputMask && this.state.value && this.state.value.includes(this.element.maskChar)) {
      state.isValid = false;
      state.errorType = 'mask';
      state.errorMessage = (component.label || component.key) + ' must use the format ' + component.inputMask;
    }
    // Custom
    if (state.isValid && component.validate.custom) {
      var custom = component.validate.custom;
      custom = custom.replace(/({{\s+(.*)\s+}})/, function (match, $1, $2) {
        return this.props.data[$2];
      }.bind(this));
      var input = item;
      var valid;
      try {
        var _props2 = this.props,
            data = _props2.data,
            row = _props2.row;

        valid = eval(custom);
        state.isValid = valid === true;
      } catch (e) {
        /* eslint-disable no-console */
        console.warn('A syntax error occurred while computing custom values in ' + component.key, e);
        /* eslint-enable no-console */
      }
      if (!state.isValid) {
        state.errorType = 'custom';
        state.errorMessage = valid || (component.label || component.key) + 'is not a valid value.';
      }
    }
    return state;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var component = this.props.component;

    var value = void 0;
    if (component.hasOwnProperty('calculateValue') && component.calculateValue) {
      if (!(0, _util.deepEqual)(this.data, nextProps.data)) {
        this.data = (0, _lodash.clone)(nextProps.data);
        try {
          var result = eval('(function(data, row) { var value = [];' + component.calculateValue.toString() + '; return value; })(this.data, nextProps.row)');
          if (this.state.value != result) {
            this.setValue(result);
          }
        } catch (e) {
          /* eslint-disable no-console */
          console.warn('An error occurred calculating a value for ' + component.key, e);
          /* eslint-enable no-console */
        }
      }
    }
    if (this.props.value !== nextProps.value) {
      value = this.safeSingleToMultiple(nextProps.value);
    }
    // This occurs when a datagrid row is deleted.
    if (value === null) {
      value = this.getDefaultValue(value);
      this.setState({
        isPristine: true
      });
    }
    if (typeof value !== 'undefined' && value !== null) {
      var valid = this.validate(value);
      this.setState({
        value: value,
        isValid: valid.isValid,
        errorType: valid.errorType,
        errorMessage: valid.errorMessage
      });
    }
    if (typeof this.willReceiveProps === 'function') {
      this.willReceiveProps(nextProps);
    }
  },
  safeSingleToMultiple: function safeSingleToMultiple(value) {
    var component = this.props.component;
    // Don't do anything to datagrid or containers.

    if (component.type === 'datagrid' || component.type === 'container') {
      return value;
    }
    // If this was a single but is not a multivalue.
    if (component.multiple && !Array.isArray(value)) {
      if (component.type === 'select' && !value) {
        value = [];
      } else {
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
  componentWillMount: function componentWillMount() {
    this.unmounting = false;
    if (!this.props.options || !this.props.options.hasOwnProperty('skipInit') || !this.props.options.skipInit) {
      this.setValue(this.state.value, null, true);
    }
    if (typeof this.props.attachToForm === 'function') {
      this.props.attachToForm(this);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.unmounting = true;
    if (typeof this.props.attachToForm === 'function') {
      this.props.detachFromForm(this);
    }
  },
  onChange: function onChange(event) {
    var value = event.target.value;
    // Allow components to respond to onChange event.
    if (typeof this.onChangeCustom === 'function') {
      value = this.onChangeCustom(value);
    }
    var index = this.props.component.multiple ? event.target.getAttribute('data-index') : null;
    this.setValue(value, index);
  },
  setValue: function setValue(value, index, pristine) {
    var _this2 = this;

    if (index === undefined) {
      index = null;
    }
    this.setState(function (previousState) {
      if (index !== null && Array.isArray(previousState.value)) {
        // Clone so we keep state immutable.
        var newValue = (0, _lodash.clone)(previousState.value);
        newValue[index] = value;
        previousState.value = newValue;
      } else {
        previousState.value = value;
      }
      previousState.isPristine = !!pristine;
      Object.assign(previousState, _this2.validate(previousState.value));
      return previousState;
    }, function () {
      if (typeof _this2.props.onChange === 'function') {
        if (!_this2.state.isPristine || _this2.props.value !== _this2.state.value) {
          _this2.props.onChange(_this2);
        }
      }
    });
  },
  getComponent: function getComponent() {
    var id = 'form-group-' + this.props.component.key;
    var classNames = 'form-group form-field-type-' + this.props.component.type + ' ' + id + (this.state.errorMessage !== '' && !this.state.isPristine ? ' has-error' : '') + (this.props.component.customClass ? ' ' + this.props.component.customClass : '');
    var Elements = this.getElements();
    var Error = this.state.errorMessage && !this.state.isPristine ? _react2.default.createElement(
      'p',
      { className: 'help-block error-' + this.state.errorType },
      this.state.errorMessage
    ) : '';
    return _react2.default.createElement(
      'div',
      { className: classNames, id: id },
      Elements,
      Error
    );
  },
  render: function render() {
    var element = this.getComponent();
    if (typeof this.props.onElementRender === 'function') {
      element = this.props.onElementRender(this, element);
    }
    return element;
  },
  getDisplay: function getDisplay(component, value) {
    if (typeof this.getValueDisplay === 'function') {
      if (Array.isArray(value) && component.multiple && component.type !== 'file') {
        return value.map(this.getValueDisplay.bind(null, component)).join(', ');
      } else {
        return this.getValueDisplay(component, value);
      }
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    // If this is still an object, something went wrong and we don't know what to do with it.
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      return '[object Object]';
    }
    return value;
  }
};