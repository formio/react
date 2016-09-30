'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioGrid = require('../components/FormioGrid');

var _FormioGrid2 = _interopRequireDefault(_FormioGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var form = _ref.form;
  var submissions = _ref.submissions;
  var pagination = _ref.pagination;
  var limit = _ref.limit;
  var isFetching = _ref.isFetching;
  var onSortChange = _ref.onSortChange;
  var onPageChange = _ref.onPageChange;
  var onButtonClick = _ref.onButtonClick;

  if (isFetching) {
    return _react2.default.createElement(
      'div',
      null,
      'Loading'
    );
  }
  return _react2.default.createElement(
    'div',
    { className: 'form-index' },
    _react2.default.createElement(_FormioGrid2.default, {
      submissions: submissions,
      form: form,
      onSortChange: onSortChange,
      onPageChange: onPageChange,
      pagination: pagination,
      limit: limit,
      onButtonClick: onButtonClick
    })
  );
};