import createReactClass from 'create-react-class';
import valueMixin from './mixins/valueMixin';
import inputMixin from './mixins/inputMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import _repeat from 'lodash/repeat';

module.exports = createReactClass({
  displayName: 'Number',
  mixins: [valueMixin, multiMixin, componentMixin, inputMixin],
  onChangeCustom: function(value) {
    if (value && this.requireDecimal) {
      if (value.indexOf('.') === -1) {
        value = value + '.' + _repeat('0', this.decimalLimit);
      }
      var parts = value.split('.');
      if (parts[1].length < this.decimalLimit) {
        value = value + _repeat('0', this.decimalLimit - parts[1].length);
      }
    }
    return value;
  },
  customMask: function() {
    const { component } = this.props;

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
    }
    else {
      maskOptions.allowDecimal = true;
      maskOptions.decimalLimit = this.decimalLimit;
      maskOptions.requireDecimal = this.requireDecimal;
    }

    return createNumberMask(maskOptions);
  },
  validateCustom: function(value) {
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
