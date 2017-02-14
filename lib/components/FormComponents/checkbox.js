'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Checkbox',
  mixins: [_valueMixin2.default, _componentMixin2.default],
  onChangeCheckbox: function onChangeCheckbox(event) {
    this.setValue(event.target.checked);
  },
  getElements: function getElements() {
    var component = this.props.component;
    var value = this.state.value;

    var required = 'control-label' + (component.validate.required ? ' field-required' : '') + (value ? ' checked' : ' not-checked');
    return _react2.default.createElement(
      'div',
      { className: 'checkbox' },
      _react2.default.createElement(
        'label',
        { className: required },
        _react2.default.createElement('input', {
          type: 'checkbox',
          id: component.key,
          name: this.props.name,
          checked: value,
          disabled: this.props.readOnly,
          onChange: this.onChangeCheckbox
        }),
        !(component.hideLabel && component.datagridLabel === false) ? component.label : ''
      )
    );
  },
  getValueDisplay: function getValueDisplay(component, data) {
    return data ? 'Yes' : 'No';
  }
});