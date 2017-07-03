'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Time',
  mixins: [_valueMixin2.default, _multiMixin2.default, _componentMixin2.default],
  customState: function customState(state) {
    state.hourTime = (0, _moment2.default)(state.value, this.props.component.format).format("HH:mm:ss");
    return state;
  },
  willReceiveProps: function willReceiveProps(nextProps) {
    var _this = this;

    this.setState(function (state) {
      state.hourTime = nextProps.value ? (0, _moment2.default)(nextProps.value, _this.props.component.format).format("HH:mm:ss") : nextProps.value;
      return state;
    });
  },
  onChangeTime: function onChangeTime(event) {
    var value = event.target.value;
    var index = this.props.component.multiple ? event.target.getAttribute('data-index') : null;
    this.setState(function (state) {
      state.hourTime = value;
      return state;
    }, this.setValue(value ? (0, _moment2.default)(value, "HH:mm:ss").format(this.props.component.format) : value, index));
  },
  getSingleElement: function getSingleElement(value, index) {
    var _this2 = this;

    index = index || 0;
    var _props = this.props,
        component = _props.component,
        name = _props.name,
        readOnly = _props.readOnly;

    var properties = {
      type: component.inputType,
      key: index,
      className: 'form-control',
      id: component.key,
      'data-index': index,
      name: name,
      value: this.state.hourTime,
      disabled: readOnly,
      placeholder: component.placeholder,
      onChange: this.onChangeTime,
      ref: function ref(input) {
        return _this2.element = input;
      }
    };

    return _react2.default.createElement('input', properties);
  }
});