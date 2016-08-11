'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');

module.exports = React.createClass({
  displayName: 'SelectBox',
  mixins: [valueMixin],
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
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? React.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline',
      'aria-hidden': 'true' }) : '';
    var checkboxClass = this.props.component.inline ? 'checkbox-inline' : 'checkbox';
    return React.createElement(
      'div',
      null,
      inputLabel,
      ' ',
      requiredInline,
      React.createElement(
        'div',
        { className: 'selectbox' },
        this.props.component.values.map(function (item, index) {
          var required = 'control-label' + (this.props.component.validate.required ? ' field-required' : '') + (this.state.value[item.value] ? ' checked' : ' not-checked');
          return React.createElement(
            'div',
            { className: checkboxClass, key: index },
            React.createElement(
              'label',
              { className: required },
              React.createElement('input', {
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
  }
});