'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopPropagationWrapper = exports.getComponentDefaultColumn = undefined;
exports.setColumnsWidth = setColumnsWidth;

var _formiojs = require('formiojs');

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getComponentDefaultColumn = exports.getComponentDefaultColumn = function getComponentDefaultColumn(component) {
  return {
    component: _formiojs.Components.create(component, null, null, true),
    key: 'data.' + component.key,
    sort: true,
    title: component.label || component.title || component.key,
    value: function value(submission) {
      var cellValue = (0, _get3.default)(submission, this.key, null);

      if (cellValue === null) {
        return '';
      }

      var rendered = this.component.asString(cellValue);
      if (cellValue !== rendered) {
        return {
          content: rendered,
          isHtml: true
        };
      }

      return cellValue;
    }
  };
};

function setColumnsWidth(columns) {
  if (columns.length > 6) {
    columns.forEach(function (column) {
      column.width = 2;
    });
  } else {
    var columnsAmount = columns.length;
    var rowWidth = 12;
    var basewidth = Math.floor(rowWidth / columnsAmount);
    var remainingWidth = rowWidth - basewidth * columnsAmount;

    columns.forEach(function (column, index) {
      column.width = index < remainingWidth ? basewidth + 1 : basewidth;
    });
  }
}

var stopPropagationWrapper = exports.stopPropagationWrapper = function stopPropagationWrapper(fn) {
  return function (event) {
    event.stopPropagation();
    fn();
  };
};