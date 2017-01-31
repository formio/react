'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _components = require('../../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Container',
  mixins: [_valueMixin2.default, _componentMixin2.default],
  getInitialValue: function getInitialValue() {
    return {};
  },
  elementChange: function elementChange(component) {
    var _this = this;

    var isValid = this.validateCustom();
    if (component.props.component.key) {
      this.setState(function (previousState) {
        // Clone to keep state immutable.
        var value = (0, _lodash.clone)(previousState.value);
        value[component.props.component.key] = component.state.value;
        previousState.value = value;
        previousState.isValid = isValid.isValid;
        // If a component isn't pristine, the container isn't pristine.
        if (!component.state.isPristine && previousState.isPristine) {
          previousState.isPristine = false;
        }
        return previousState;
      }, function () {
        return _this.props.onChange(component, { container: _this });
      });
    }
  },
  attachToForm: function attachToForm(component) {
    this.inputs = this.inputs || {};
    this.inputs[component.props.component.key] = component;
    this.props.onChange(this);
  },

  detachFromForm: function detachFromForm(component) {
    if (this.unmounting) {
      return;
    }
    var value = (0, _lodash.clone)(this.state.value);
    if (component.props.component.key && value && value.hasOwnProperty(component.props.component.key)) {
      delete value[component.props.component.key];
      this.setValue(value);
    }
    delete this.inputs[component.props.component.key];
    this.props.onChange(this);
  },
  validateCustom: function validateCustom() {
    var _this2 = this;

    var isValid = true;
    // If any inputs are false, the datagrid is false.
    if (this.inputs) {
      Object.keys(this.inputs).forEach(function (key) {
        if (_this2.inputs[key].state.isValid === false) {
          isValid = false;
        }
      });
    }
    return {
      isValid: isValid,
      errorMessage: ''
    };
  },
  getElements: function getElements() {
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    return _react2.default.createElement(
      'div',
      { className: 'formio-container' },
      _react2.default.createElement(_components.FormioComponentsList, _extends({}, this.props, {
        components: this.props.component.components,
        values: this.state.value,
        onChange: this.elementChange,
        attachToForm: this.attachToForm,
        detachFromForm: this.detachFromForm
      }))
    );
  }
});