'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('formiojs/utils');

var _utils2 = _interopRequireDefault(_utils);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../constants');

var _types = require('../types');

var _utils3 = require('../utils');

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubmissionGrid = function (_React$Component) {
  _inherits(SubmissionGrid, _React$Component);

  function SubmissionGrid() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SubmissionGrid);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SubmissionGrid.__proto__ || Object.getPrototypeOf(SubmissionGrid)).call.apply(_ref, [this].concat(args))), _this), _this.onSort = function (_ref2) {
      var key = _ref2.key,
          sort = _ref2.sort;

      if ((0, _isFunction3.default)(sort)) {
        return sort();
      }

      var _this$props = _this.props,
          getSubmissions = _this$props.getSubmissions,
          currentSort = _this$props.submissions.sort;


      var sortKey = (0, _isString3.default)(sort) ? sort : key;
      var ascSort = sortKey;
      var descSort = '-' + sortKey;
      var noSort = '';

      var nextSort = noSort;
      if (currentSort === ascSort) {
        nextSort = descSort;
      } else if (currentSort === descSort) {
        nextSort = noSort;
      } else {
        nextSort = ascSort;
      }

      getSubmissions(1, {
        sort: nextSort
      });
    }, _this.getColumns = function (form) {
      var columns = [];

      _utils2.default.eachComponent(form.components, function (component) {
        if (component.input && component.tableView && component.key) {
          columns.push((0, _utils3.getComponentDefaultColumn)(component));
        }
      });

      columns.push({
        key: 'operations',
        title: 'Operations'
      });

      (0, _utils3.setColumnsWidth)(columns);

      return columns;
    }, _this.Cell = function (_ref3) {
      var submission = _ref3.row,
          column = _ref3.column;
      var _this$props2 = _this.props,
          form = _this$props2.form,
          onAction = _this$props2.onAction,
          operations = _this$props2.operations;


      if (column.key === 'operations') {
        return _react2.default.createElement(
          'div',
          null,
          operations.map(function (_ref4) {
            var action = _ref4.action,
                _ref4$buttonType = _ref4.buttonType,
                buttonType = _ref4$buttonType === undefined ? 'primary' : _ref4$buttonType,
                _ref4$icon = _ref4.icon,
                icon = _ref4$icon === undefined ? '' : _ref4$icon,
                _ref4$permissionsReso = _ref4.permissionsResolver,
                permissionsResolver = _ref4$permissionsReso === undefined ? function () {
              return true;
            } : _ref4$permissionsReso,
                _ref4$title = _ref4.title,
                title = _ref4$title === undefined ? '' : _ref4$title;
            return permissionsResolver(form, submission) ? _react2.default.createElement(
              'span',
              {
                className: 'btn btn-' + buttonType + ' btn-sm form-btn',
                onClick: (0, _utils3.stopPropagationWrapper)(function () {
                  return onAction(submission, action);
                }),
                key: action
              },
              icon ? _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement('i', { className: 'fa fa-' + icon }),
                '\xA0'
              ) : null,
              title
            ) : null;
          })
        );
      }

      var value = (0, _isFunction3.default)(column.value) ? column.value(submission) : (0, _get3.default)(submission, column.key, '');

      return (0, _isObject3.default)(value) && value.content ? value.isHtml ? _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: value.content } }) : _react2.default.createElement(
        'span',
        null,
        String(value.content)
      ) : _react2.default.createElement(
        'span',
        null,
        String(value)
      );
    }, _this.render = function () {
      var _this$props3 = _this.props,
          propColumns = _this$props3.columns,
          form = _this$props3.form,
          getSubmissions = _this$props3.getSubmissions,
          onAction = _this$props3.onAction,
          onPageSizeChanged = _this$props3.onPageSizeChanged,
          pageSizes = _this$props3.pageSizes,
          _this$props3$submissi = _this$props3.submissions,
          limit = _this$props3$submissi.limit,
          _this$props3$submissi2 = _this$props3$submissi.pagination,
          page = _this$props3$submissi2.page,
          numPages = _this$props3$submissi2.numPages,
          total = _this$props3$submissi2.total,
          sort = _this$props3$submissi.sort,
          submissions = _this$props3$submissi.submissions;


      var columns = propColumns.length ? propColumns : _this.getColumns(form);
      var skip = (page - 1) * limit;
      var last = Math.min(skip + limit, total);

      return _react2.default.createElement(_Grid2.default, {
        Cell: _this.Cell,
        activePage: page,
        columns: columns,
        emptyText: 'No data found',
        firstItem: skip + 1,
        items: submissions,
        lastItem: last,
        onAction: onAction,
        onPage: getSubmissions,
        onPageSizeChanged: onPageSizeChanged,
        onSort: _this.onSort,
        pageSize: limit,
        pageSizes: pageSizes,
        pages: numPages,
        sortOrder: sort,
        total: total
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return SubmissionGrid;
}(_react2.default.Component);

SubmissionGrid.propTypes = {
  columns: _types.Columns,
  form: _propTypes2.default.object.isRequired,
  getSubmissions: _propTypes2.default.func,
  onAction: _propTypes2.default.func,
  onPageSizeChanged: _propTypes2.default.func,
  operations: _types.Operations,
  pageSizes: _types.PageSizes,
  submissions: _propTypes2.default.object.isRequired
};
SubmissionGrid.defaultProps = {
  columns: [],
  getSubmissions: function getSubmissions() {},
  onAction: function onAction() {},
  onPageSizeChanged: function onPageSizeChanged() {},
  operations: [{
    action: 'view',
    buttonType: 'warning',
    icon: 'list-alt',
    permissionsResolver: function permissionsResolver() {
      return true;
    },

    title: 'View'
  }, {
    action: 'edit',
    buttonType: 'secondary',
    icon: 'edit',
    permissionsResolver: function permissionsResolver() {
      return true;
    },

    title: 'Edit'
  }, {
    action: 'delete',
    buttonType: 'danger',
    icon: 'trash',
    permissionsResolver: function permissionsResolver() {
      return true;
    }
  }],
  pageSizes: _constants.defaultPageSizes
};
exports.default = SubmissionGrid;