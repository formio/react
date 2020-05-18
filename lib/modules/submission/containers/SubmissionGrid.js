'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('formiojs/utils');

var _utils2 = _interopRequireDefault(_utils);

var _components = require('formiojs/components');

var _components2 = _interopRequireDefault(_components);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _Grid = require('../../../components/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Component) {
  _inherits(_class, _Component);

  function _class() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.getColumns = function () {
      var columns = [];
      _utils2.default.eachComponent(_this.props.form.components, function (component) {
        if (component.input && component.tableView && component.key) {
          columns.push({
            key: 'data.' + component.key,
            title: component.label || component.title || component.key,
            sort: '',
            component: _components2.default.create(component, null, null, true)
          });
        }
      });
      return columns.slice(0, 12);
    }, _this.calculateWidths = function (columns) {
      var result = {};
      var left = 12;
      var basewidth = Math.floor(12 / columns);
      for (var _i = 0; _i < columns; _i++) {
        result[_i] = basewidth;
        left -= basewidth;
      }
      for (var i = 0; i < left; i++) {
        result[i]++;
      }
      return result;
    }, _this.Cell = function (props) {
      var row = props.row,
          column = props.column;

      var cellValue = (0, _get3.default)(row, column.key);

      if (cellValue === null) {
        return null;
      }
      var rendered = column.component.asString(cellValue);
      if (cellValue !== rendered) {
        return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: rendered } });
      } else {
        return _react2.default.createElement(
          'span',
          null,
          cellValue
        );
      }
    }, _this.render = function () {
      var _this$props = _this.props,
          submissions = _this$props.submissions,
          onRowClick = _this$props.onRowClick,
          onSort = _this$props.onSort,
          onPage = _this$props.onPage,
          page = _this$props.page,
          limit = _this$props.limit,
          sortOrder = _this$props.sortOrder;

      var columns = _this.getColumns();
      var columnWidths = _this.calculateWidths(columns.length);

      return _react2.default.createElement(_Grid2.default, {
        submissions: submissions,
        columns: columns,
        columnWidths: columnWidths,
        onSort: onSort,
        onClick: onRowClick,
        onPage: onPage,
        sortOrder: sortOrder,
        activePage: page + 1,
        firstItem: parseInt(submissions.skip) + 1,
        lastItem: parseInt(submissions.skip) + parseInt(submissions.limit),
        total: parseInt(submissions.serverCount),
        pages: Math.ceil(submissions.serverCount / limit),
        Cell: _this.Cell
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return _class;
}(_react.Component);

_class.propTypes = {
  submissions: _propTypes2.default.array.isRequired,
  form: _propTypes2.default.object.isRequired,
  onRowClick: _propTypes2.default.func
};
_class.defaultProps = {
  onRowClick: function onRowClick() {}
};
exports.default = _class;