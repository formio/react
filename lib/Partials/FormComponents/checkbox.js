'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Checkbox',
  mixins: [_valueMixin2.default, _multiMixin2.default],
  onChangeCheckbox: function onChangeCheckbox(event) {
    var value = event.target.checked;
    var index = this.props.component.multiple ? event.target.getAttribute('data-index') : null;
    this.setValue(value, index);
  },
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    var required = 'control-label' + (this.props.component.validate.required ? ' field-required' : '') + (value ? ' checked' : ' not-checked');
    return _react2.default.createElement(
      'div',
      { className: 'checkbox' },
      _react2.default.createElement(
        'label',
        { className: required },
        _react2.default.createElement('input', {
          type: 'checkbox',
          id: this.props.component.key,
          'data-index': index,
          name: this.props.name,
          checked: value,
          disabled: this.props.readOnly,
          onChange: this.onChangeCheckbox
        }),
        this.props.component.label
      )
    );
  }
});