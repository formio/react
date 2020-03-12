'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormGrid = function (_React$Component) {
  _inherits(FormGrid, _React$Component);

  function FormGrid() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FormGrid);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FormGrid.__proto__ || Object.getPrototypeOf(FormGrid)).call.apply(_ref, [this].concat(args))), _this), _this.onSort = function (_ref2) {
      var key = _ref2.key,
          sort = _ref2.sort;

      if ((0, _isFunction3.default)(sort)) {
        return sort();
      }

      var _this$props = _this.props,
          currentSort = _this$props.forms.sort,
          getForms = _this$props.getForms;


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

      getForms(1, {
        sort: nextSort
      });
    }, _this.Cell = function (_ref3) {
      var form = _ref3.row,
          column = _ref3.column;
      var _this$props2 = _this.props,
          formAccess = _this$props2.formAccess,
          onAction = _this$props2.onAction,
          _this$props2$operatio = _this$props2.operations,
          operations = _this$props2$operatio === undefined ? [] : _this$props2$operatio;


      var access = formAccess(form);

      if (column.key === 'title') {
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
      } else if (column.key === 'operations') {
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
            return permissionsResolver(form) ? _react2.default.createElement(
              'span',
              {
                className: 'btn btn-' + buttonType + ' btn-sm form-btn',
                onClick: (0, _utils.stopPropagationWrapper)(function () {
                  return onAction(form, action);
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

      return _react2.default.createElement(
        'span',
        null,
        (0, _isFunction3.default)(column.value) ? column.value(form) : (0, _get3.default)(form, column.key, '')
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FormGrid, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          columns = _props.columns,
          _props$forms = _props.forms,
          forms = _props$forms.forms,
          limit = _props$forms.limit,
          _props$forms$paginati = _props$forms.pagination,
          page = _props$forms$paginati.page,
          numPages = _props$forms$paginati.numPages,
          total = _props$forms$paginati.total,
          sort = _props$forms.sort,
          getForms = _props.getForms,
          onAction = _props.onAction,
          onPageSizeChanged = _props.onPageSizeChanged,
          pageSizes = _props.pageSizes;


      var skip = (page - 1) * limit;
      var last = Math.min(skip + limit, total);

      return _react2.default.createElement(_Grid2.default, {
        Cell: this.Cell,
        activePage: page,
        columns: columns,
        emptyText: 'No forms found',
        firstItem: skip + 1,
        items: forms,
        lastItem: last,
        onAction: onAction,
        onPage: getForms,
        onPageSizeChanged: onPageSizeChanged,
        onSort: this.onSort,
        pageSize: limit,
        pageSizes: pageSizes,
        pages: numPages,
        sortOrder: sort,
        total: total
      });
    }
  }]);

  return FormGrid;
}(_react2.default.Component);

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
exports.default = FormGrid;