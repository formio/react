'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Radio',
  mixins: [valueMixin, multiMixin],
  onChangeRadio: function onChangeRadio(event) {
    var value = event.target.id;
    this.setValue(value, 0);
  },
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    var radioClass = this.props.component.inline ? 'radio-inline' : 'radio';
    return React.createElement(
      'div',
      { className: 'radio-wrapper' },
      this.props.component.values.map(function (v, id) {
        var controlLabel = 'control-label' + (v.value === this.state.value ? ' checked' : ' not-checked');
        return React.createElement(
          'div',
          { key: id, className: radioClass },
          React.createElement(
            'label',
            { className: controlLabel },
            React.createElement('input', {
              type: this.props.component.inputType,
              id: v.value,
              'data-index': index,
              name: this.props.component.key,
              checked: v.value === this.state.value,
              disabled: this.props.readOnly,
              onChange: this.onChangeRadio
            }),
            v.label
          )
        );
      }.bind(this))
    );
  }
});