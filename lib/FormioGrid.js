'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioGrid = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _formioUtils = require('formio-utils');

var _formioUtils2 = _interopRequireDefault(_formioUtils);

var _reactabular = require('reactabular');

var _Paginator = require('./Partials/Paginator');

var _Paginator2 = _interopRequireDefault(_Paginator);

var _util = require('./util');

var _FormioComponents = require('./Partials/FormioComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormioGrid = function (_React$Component) {
  _inherits(FormioGrid, _React$Component);

  function FormioGrid(props) {
    _classCallCheck(this, FormioGrid);

    var _this = _possibleConstructorReturn(this, (FormioGrid.__proto__ || Object.getPrototypeOf(FormioGrid)).call(this, props));

    _this.formatCell = function (value, _ref) {
      var column = _ref.column;

      return _FormioComponents.FormioComponents.getComponent(column.component.type).prototype.getDisplay(column.component, value);
    };

    _this.columnsFromForm = function (form) {
      var columns = [];
      var buttons = _this.props.buttons.map(function (button) {
        return {
          property: '_id',
          header: {
            label: button.label
          },
          cell: {
            format: function format(rowKey, _ref2) {
              var rowData = _ref2.rowData;

              return _react2.default.createElement(
                'a',
                { className: button.class, onClick: function onClick(event) {
                    _this.onButtonClick(event, button.event, rowData);
                  } },
                function () {
                  if (button.icon) {
                    return _react2.default.createElement('i', { className: button.icon, 'aria-hidden': 'true' });
                  }
                }(),
                _react2.default.createElement(
                  'span',
                  null,
                  button.label
                )
              );
            }
          },
          visible: true
        };
      });
      if (form && form.components) {
        _formioUtils2.default.eachComponent(form.components, function (component, path) {
          if (component.input && component.tableView && component.key && path.indexOf('.') === -1) {
            columns.push({
              component: component,
              property: 'data.' + component.key,
              header: {
                label: component.label || component.key,
                props: {
                  style: {
                    width: 100
                  }
                }
              },
              cell: {
                format: _this.formatCell
              },
              visible: true
            });
          }
        });
      }
      if (!buttons.length) {
        return columns;
      }
      if (_this.props.buttonLocation === 'right') {
        return columns.concat(buttons);
      } else {
        return buttons.concat(columns);
      }
    };

    _this.componentWillReceiveProps = function (nextProps) {
      if (nextProps.form !== _this.props.form) {
        _this.setState({
          columns: _this.columnsFromForm(nextProps.form)
        });
      }
      if (nextProps.submissions !== _this.state.submissions) {
        _this.setState({
          submissions: nextProps.submissions
        });
      }
      if (nextProps.paginationPage !== _this.state.paginationPage) {
        _this.setState({
          paginationPage: nextProps.paginationPage
        });
      }
      if (nextProps.paginationNumPage !== _this.state.paginationNumPage) {
        _this.setState({
          paginationNumPage: nextProps.paginationNumPage
        });
      }
      if (nextProps.paginationSize !== _this.state.paginationSize) {
        _this.setState({
          limit: nextProps.paginationSize
        });
      }
    };

    _this.componentDidMount = function () {
      if (_this.props.src) {
        _this.formio = new _formiojs2.default(_this.props.src);
        _this.loadForm();
        _this.loadSubmissions();
      }
    };

    _this.loadForm = function () {
      _this.formio.loadForm().then(function (form) {
        _this.setState({
          columns: _this.columnsFromForm(form)
        });
      });
    };

    _this.loadSubmissions = function () {
      _this.formio.loadSubmissions({
        params: _extends({}, _this.props.query, {
          limit: _this.state.paginationSize,
          skip: (_this.state.paginationPage - 1) * _this.state.paginationSize
        })
      }).then(function (submissions) {
        _this.setState({
          submissions: submissions,
          paginationNumPages: Math.ceil(submissions.serverCount / _this.state.paginationSize)
        });
      });
    };

    _this.onButtonClick = function (event, type, row) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof _this.props.onButtonClick === 'function') {
        _this.props.onButtonClick(type, row._id);
      }
    };

    _this.onRowClick = function (row) {
      return {
        onClick: function onClick() {
          if (typeof _this.props.onButtonClick === 'function') {
            _this.props.onButtonClick('row', row._id);
          }
        }
      };
    };

    _this.onPageChange = function (page) {
      if (typeof _this.props.onPageChange === 'function') {
        _this.props.onPageChange(page);
      } else {
        _this.setState({
          paginationPage: page
        }, _this.loadSubmissions);
      }
    };

    _this.render = function () {
      var rows = _reactabular.resolve.resolve({
        columns: _this.state.columns,
        method: _util.nested
      })(_this.state.submissions);
      return _react2.default.createElement(
        'div',
        { className: 'table-responsive' },
        _react2.default.createElement(
          _reactabular.Table.Provider,
          {
            className: 'table table-striped table-bordered table-hover',
            columns: _this.state.columns
          },
          _react2.default.createElement(_reactabular.Table.Header, null),
          _react2.default.createElement(_reactabular.Table.Body, {
            rows: rows,
            rowKey: '_id',
            onRow: _this.onRowClick
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'controls' },
          _react2.default.createElement(_Paginator2.default, {
            paginationPage: _this.state.paginationPage,
            paginationNumPages: _this.state.paginationNumPages,
            onSelect: _this.onPageChange
          })
        )
      );
    };

    _this.state = {
      columns: _this.columnsFromForm(props.form),
      submissions: _this.props.submissions || [],
      paginationPage: _this.props.paginationPage,
      paginationNumPage: _this.props.paginationNumPage,
      paginationSize: _this.props.paginationSize
    };
    return _this;
  }

  return FormioGrid;
}(_react2.default.Component);

FormioGrid.defaultProps = {
  form: {},
  submissions: [],
  query: {
    sort: '-created'
  },
  paginationPage: 1,
  paginationNumPages: 1,
  paginationSizes: [25, 50, 75],
  paginationSize: 25,
  buttons: [],
  buttonLocation: 'right'
};
FormioGrid.propTypes = {
  src: _react2.default.PropTypes.string
};
exports.FormioGrid = FormioGrid;