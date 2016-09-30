'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFormio = require('react-formio');

var _reactFormio2 = _interopRequireDefault(_reactFormio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var form = _ref.form;
  var onFormSubmit = _ref.onFormSubmit;

  if (!form.isFetching && form.form) {
    return _react2.default.createElement(
      'div',
      { className: 'form-create' },
      _react2.default.createElement(_reactFormio2.default, { src: form.src, form: form.form, onFormSubmit: onFormSubmit })
    );
  } else {
    return _react2.default.createElement(
      'div',
      { className: 'form-create' },
      'Loading...'
    );
  }
};