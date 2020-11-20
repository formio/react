'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('../constants');

var _types = require('../types');

var _utils = require('../utils');

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormGrid = function FormGrid(props) {
  var getSortQuery = function getSortQuery(key, sort) {
    var currentSort = props.forms.sort;


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

    var getForms = props.getForms;


    getForms(1, {
      sort: getSortQuery(key, sort)
    });
  };

  var TitleCell = function TitleCell(_ref2) {
    var access = _ref2.access,
        form = _ref2.form;
    return _react2.default.createElement(
      'span',
      {
        style: { cursor: 'pointer' },
        onClick: (0, _utils.stopPropagationWrapper)(function () {
          if (access.submission.create) {
            onAction(form, 'view');
          }
        })
      },
      _react2.default.createElement(
        'h5',
        null,
        form.title
      )
    );
  };

  var Icon = function Icon(_ref3) {
    var icon = _ref3.icon;
    return _react2.default.createElement(
      'span',
      null,
      _react2.default.createElement('i', { className: 'fa fa-' + icon }),
      '\xA0'
    );
  };

  var OperationButton = function OperationButton(_ref4) {
    var action = _ref4.action,
        onAction = _ref4.onAction,
        form = _ref4.form,
        buttonType = _ref4.buttonType,
        icon = _ref4.icon,
        title = _ref4.title;
    return _react2.default.createElement(
      'span',
      {
        className: 'btn btn-' + buttonType + ' btn-sm form-btn',
        onClick: (0, _utils.stopPropagationWrapper)(function () {
          return onAction(form, action);
        })
      },
      icon ? _react2.default.createElement(Icon, { icon: icon }) : null,
      title
    );
  };

  var Cell = function Cell(_ref5) {
    var form = _ref5.row,
        column = _ref5.column;
    var formAccess = props.formAccess,
        onAction = props.onAction,
        _props$operations = props.operations,
        operations = _props$operations === undefined ? [] : _props$operations;


    var access = formAccess(form);

    if (column.key === 'title') {
      return _react2.default.createElement(TitleCell, { access: access, form: form });
    } else if (column.key === 'operations') {
      return _react2.default.createElement(
        'div',
        null,
        operations.map(function (_ref6) {
          var action = _ref6.action,
              _ref6$buttonType = _ref6.buttonType,
              buttonType = _ref6$buttonType === undefined ? 'primary' : _ref6$buttonType,
              _ref6$icon = _ref6.icon,
              icon = _ref6$icon === undefined ? '' : _ref6$icon,
              _ref6$permissionsReso = _ref6.permissionsResolver,
              permissionsResolver = _ref6$permissionsReso === undefined ? function () {
            return true;
          } : _ref6$permissionsReso,
              _ref6$title = _ref6.title,
              title = _ref6$title === undefined ? '' : _ref6$title;
          return permissionsResolver(form) ? _react2.default.createElement(OperationButton, {
            key: action,
            action: action,
            buttonType: buttonType,
            icon: icon,
            title: title,
            form: form,
            onAction: onAction
          }) : null;
        })
      );
    }

    return _react2.default.createElement(
      'span',
      null,
      (0, _isFunction3.default)(column.value) ? column.value(form) : (0, _get3.default)(form, column.key, '')
    );
  };

  var columns = props.columns,
      _props$forms = props.forms,
      forms = _props$forms.forms,
      limit = _props$forms.limit,
      _props$forms$paginati = _props$forms.pagination,
      page = _props$forms$paginati.page,
      numPages = _props$forms$paginati.numPages,
      total = _props$forms$paginati.total,
      sort = _props$forms.sort,
      getForms = props.getForms,
      onAction = props.onAction,
      onPageSizeChanged = props.onPageSizeChanged,
      pageSizes = props.pageSizes;


  var skip = (page - 1) * limit;
  var last = Math.min(skip + limit, total);

  return _react2.default.createElement(_Grid2.default, {
    Cell: Cell,
    activePage: page,
    columns: columns,
    emptyText: 'No forms found',
    firstItem: skip + 1,
    items: forms,
    lastItem: last,
    onAction: onAction,
    onPage: getForms,
    onPageSizeChanged: onPageSizeChanged,
    onSort: onSort,
    pageSize: limit,
    pageSizes: pageSizes,
    pages: numPages,
    sortOrder: sort,
    total: total
  });
};

FormGrid.defaultProps = {
  columns: [{
    key: 'title',
    sort: true,
    title: 'Form',
    width: 8
  }, {
    key: 'operations',
    title: 'Operations',
    width: 4
  }],
  formAccess: function formAccess() {
    return {
      form: {
        create: true,
        view: true,
        edit: true,
        delete: true
      },
      submission: {
        create: true,
        view: true,
        edit: true,
        delete: true
      }
    };
  },
  getForms: function getForms() {},
  onPageSizeChanged: function onPageSizeChanged() {},
  operations: [{
    action: 'view',
    buttonType: 'primary',
    icon: 'pencil',
    permissionsResolver: function permissionsResolver() {
      return true;
    },

    title: 'Enter Data'
  }, {
    action: 'submission',
    buttonType: 'warning',
    icon: 'list-alt',
    permissionsResolver: function permissionsResolver() {
      return true;
    },

    title: 'View Data'
  }, {
    action: 'edit',
    buttonType: 'secondary',
    icon: 'edit',
    permissionsResolver: function permissionsResolver() {
      return true;
    },

    title: 'Edit Form'
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

FormGrid.propTypes = {
  columns: _types.Columns,
  formAccess: _propTypes2.default.func,
  forms: _propTypes2.default.object.isRequired,
  getForms: _propTypes2.default.func,
  onAction: _propTypes2.default.func,
  onPageSizeChanged: _propTypes2.default.func,
  operations: _types.Operations,
  pageSizes: _types.PageSizes
};

exports.default = FormGrid;