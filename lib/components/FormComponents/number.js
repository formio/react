'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Number',
  mixins: [_valueMixin2.default, _multiMixin2.default, _componentMixin2.default],
  getInitialValue: function getInitialValue() {
    return 0;
  },
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    return _react2.default.createElement('input', {
      type: this.props.component.inputType,
      className: 'form-control',
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      mask: this.props.component.inputMask,
      min: this.props.component.validate.min,
      max: this.props.component.validate.max,
      step: this.props.component.validate.step,
      onChange: this.onChange
    });
  }
});