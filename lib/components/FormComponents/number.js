'use strict';

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _inputMixin = require('./mixins/inputMixin');

var _inputMixin2 = _interopRequireDefault(_inputMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _createNumberMask = require('text-mask-addons/dist/createNumberMask');

var _createNumberMask2 = _interopRequireDefault(_createNumberMask);

var _repeat2 = require('lodash/repeat');

var _repeat3 = _interopRequireDefault(_repeat2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _createReactClass2.default)({
  displayName: 'Number',
  mixins: [_valueMixin2.default, _multiMixin2.default, _componentMixin2.default, _inputMixin2.default],
  onChangeCustom: function onChangeCustom(value) {
    if (value && this.requireDecimal) {
      if (value.indexOf('.') === -1) {
        value = value + '.' + (0, _repeat3.default)('0', this.decimalLimit);
      }
      var parts = value.split('.');
      if (parts[1].length < this.decimalLimit) {
        value = value + (0, _repeat3.default)('0', this.decimalLimit - parts[1].length);
      }
    }
    return value;
  },
  customMask: function customMask() {
    var component = this.props.component;


    this.decimalLimit = component.hasOwnProperty('decimalLimit') ? component.decimalLimit : null;
    this.requireDecimal = component.hasOwnProperty('requireDecimal') ? component.requireDecimal : false;

    var maskOptions = {
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: component.hasOwnProperty('thousandsSeparator') ? component.thousandsSeparator : '',
      allowDecimal: true,
      allowNegative: true
    };

    if (this.decimalLimit === 0) {
      maskOptions.allowDecimal = false;
    } else {
      maskOptions.allowDecimal = true;
      maskOptions.decimalLimit = this.decimalLimit;
      maskOptions.requireDecimal = this.requireDecimal;
    }

    return (0, _createNumberMask2.default)(maskOptions);
  },
  validateCustom: function validateCustom(value) {
    if (value !== '-_') {
      return {
        isValid: true
      };
    }
    return {
      isValid: false,
      errorType: 'number',
      errorMessage: 'Must be a number'
    };
  }
});