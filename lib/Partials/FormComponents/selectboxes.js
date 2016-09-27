'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'SelectBox',
  mixins: [_valueMixin2.default],
  getInitialValue: function getInitialValue() {
    return {};
  },
  onChangeCheckbox: function onChangeCheckbox(key, e) {
    var value = this.state.value;
    value[key] = e.target.checked;
    this.setValue(value);
  },
  getElements: function getElements() {
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? _react2.default.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline',
      'aria-hidden': 'true' }) : '';
    var checkboxClass = this.props.component.inline ? 'checkbox-inline' : 'checkbox';
    return _react2.default.createElement(
      'div',
      null,
      inputLabel,
      ' ',
      requiredInline,
      _react2.default.createElement(
        'div',
        { className: 'selectbox' },
        this.props.component.values.map(function (item, index) {
          var required = 'control-label' + (this.props.component.validate.required ? ' field-required' : '') + (this.state.value[item.value] ? ' checked' : ' not-checked');
          return _react2.default.createElement(
            'div',
            { className: checkboxClass, key: index },
            _react2.default.createElement(
              'label',
              { className: required },
              _react2.default.createElement('input', {
                type: 'checkbox',
                key: this.props.component.key,
                name: this.props.name,
                checked: this.state.value[item.value] || '',
                onChange: this.onChangeCheckbox.bind(null, item.value)
              }),
              item.label
            )
          );
        }.bind(this))
      )
    );
  },
  getValueDisplay: function getValueDisplay(component, data) {
    if (!data) return '';

    return Object.keys(data).filter(function (key) {
      return data[key];
    }).map(function (data) {
      component.values.forEach(function (item) {
        if (item.value === data) {
          data = item.label;
        }
      });
      return data;
    }).join(', ');
  }
});