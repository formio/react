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

var SubmissionGrid = function SubmissionGrid(props) {
  var getSortQuery = function getSortQuery(key, sort) {
    var currentSort = props.submissions.sort;


    var sortKey = (0, _isString3.default)(sort) ? sort : key;
    var ascSort = sortKey;
    var descSort = '-' + sortKey;
    var noSort = '';

    if (currentSort === ascSort) {
      return descSort;
    } else if (currentSort === descSort) {
      return noSort;
    } else {
      return ascSort;
    }
  };

  var onSort = function onSort(_ref) {
    var key = _ref.key,
        sort = _ref.sort;

    if ((0, _isFunction3.default)(sort)) {
      return sort();
    }

    var getSubmissions = props.getSubmissions;


    getSubmissions(1, {
      sort: getSortQuery(key, sort)
    });
  };

  var getColumns = function getColumns(form) {
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
  };

  var Icon = function Icon(_ref2) {
    var icon = _ref2.icon;
    return _react2.default.createElement(
      'span',
      null,
      _react2.default.createElement('i', { className: 'fa fa-' + icon }),
      '\xA0'
    );
  };

  var OperationButton = function OperationButton(_ref3) {
    var action = _ref3.action,
        buttonType = _ref3.buttonType,
        icon = _ref3.icon,
        title = _ref3.title,
        onAction = _ref3.onAction,
        submission = _ref3.submission;
    return _react2.default.createElement(
      'span',
      {
        className: 'btn btn-' + buttonType + ' btn-sm form-btn',
        onClick: (0, _utils3.stopPropagationWrapper)(function () {
          return onAction(submission, action);
        })
      },
      icon ? _react2.default.createElement(Icon, { icon: icon }) : null,
      title
    );
  };

  var Cell = function Cell(_ref4) {
    var submission = _ref4.row,
        column = _ref4.column;
    var form = props.form,
        onAction = props.onAction,
        operations = props.operations;


    if (column.key === 'operations') {
      return _react2.default.createElement(
        'div',
        null,
        operations.map(function (_ref5) {
          var action = _ref5.action,
              _ref5$buttonType = _ref5.buttonType,
              buttonType = _ref5$buttonType === undefined ? 'primary' : _ref5$buttonType,
              _ref5$icon = _ref5.icon,
              icon = _ref5$icon === undefined ? '' : _ref5$icon,
              _ref5$permissionsReso = _ref5.permissionsResolver,
              permissionsResolver = _ref5$permissionsReso === undefined ? function () {
            return true;
          } : _ref5$permissionsReso,
              _ref5$title = _ref5.title,
              title = _ref5$title === undefined ? '' : _ref5$title;
          return permissionsResolver(form, submission) ? _react2.default.createElement(OperationButton, {
            key: action,
            action: action,
            buttonType: buttonType,
            icon: icon,
            title: title,
            submission: submission,
            onAction: onAction
          }) : null;
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
  };

  var propColumns = props.columns,
      form = props.form,
      getSubmissions = props.getSubmissions,
      onAction = props.onAction,
      onPageSizeChanged = props.onPageSizeChanged,
      pageSizes = props.pageSizes,
      _props$submissions = props.submissions,
      limit = _props$submissions.limit,
      _props$submissions$pa = _props$submissions.pagination,
      page = _props$submissions$pa.page,
      numPages = _props$submissions$pa.numPages,
      total = _props$submissions$pa.total,
      sort = _props$submissions.sort,
      submissions = _props$submissions.submissions;


  var columns = propColumns.length ? propColumns : getColumns(form);
  var skip = (page - 1) * limit;
  var last = Math.min(skip + limit, total);

  return _react2.default.createElement(_Grid2.default, {
    Cell: Cell,
    activePage: page,
    columns: columns,
    emptyText: 'No data found',
    firstItem: skip + 1,
    items: submissions,
    lastItem: last,
    onAction: onAction,
    onPage: getSubmissions,
    onPageSizeChanged: onPageSizeChanged,
    onSort: onSort,
    pageSize: limit,
    pageSizes: pageSizes,
    pages: numPages,
    sortOrder: sort,
    total: total
  });
};

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