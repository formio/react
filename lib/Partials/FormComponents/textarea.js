'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Textarea',
  mixins: [_valueMixin2.default, _multiMixin2.default],
  getSingleElement: function getSingleElement(value, index) {
    index = index || 0;
    return _react2.default.createElement('textarea', {
      className: 'form-control',
      key: index,
      id: this.props.component.key,
      'data-index': index,
      name: this.props.name,
      value: value,
      disabled: this.props.readOnly,
      placeholder: this.props.component.placeholder,
      rows: this.props.component.rows,
      onChange: this.onChange
    });
  }
});