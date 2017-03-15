'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactQuill = require('react-quill');

var _reactQuill2 = _interopRequireDefault(_reactQuill);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Textarea',
  mixins: [_valueMixin2.default, _multiMixin2.default, _componentMixin2.default],
  customState: function customState(state) {
    var _props = this.props,
        component = _props.component,
        readOnly = _props.readOnly;

    this.isWysiwig = false;
    if (!readOnly && component.wysiwyg) {
      this.isWysiwig = true;
    }
    return state;
  },
  onChangeWysiwyg: function onChangeWysiwyg(index, value) {
    this.setValue(value, index);
  },
  getSingleElement: function getSingleElement(value, index) {
    var _props2 = this.props,
        component = _props2.component,
        name = _props2.name,
        readOnly = _props2.readOnly;

    index = index || 0;
    if (this.isWysiwig) {
      return _react2.default.createElement(_reactQuill2.default, {
        key: index,
        id: component.key,
        'data-index': index,
        name: name,
        value: value,
        theme: 'snow',
        disabled: readOnly,
        placeholder: component.placeholder,
        rows: component.rows,
        onChange: this.onChangeWysiwyg.bind(null, index)
      });
    } else {
      return _react2.default.createElement('textarea', {
        className: 'form-control',
        key: index,
        id: component.key,
        'data-index': index,
        name: name,
        value: value,
        disabled: readOnly,
        placeholder: component.placeholder,
        rows: component.rows,
        onChange: this.onChange
      });
    }
  }
});