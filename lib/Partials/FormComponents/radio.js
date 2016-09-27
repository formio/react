'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Radio',
  mixins: [_valueMixin2.default, _multiMixin2.default],
  onChangeRadio: function onChangeRadio(event) {
    var value = event.target.id;
    this.setValue(value);
  },
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    var radioClass = this.props.component.inline ? 'radio-inline' : 'radio';
    return _react2.default.createElement(
      'div',
      { className: 'radio-wrapper' },
      this.props.component.values.map(function (v, id) {
        var controlLabel = 'control-label' + (v.value === this.state.value ? ' checked' : ' not-checked');
        return _react2.default.createElement(
          'div',
          { key: id, className: radioClass },
          _react2.default.createElement(
            'label',
            { className: controlLabel },
            _react2.default.createElement('input', {
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
  },
  getValueDisplay: function getValueDisplay(component, data) {
    for (var i in component.values) {
      if (component.values[i].value === data) {
        return component.values[i].label;
      }
    }
    return data;
  }
});