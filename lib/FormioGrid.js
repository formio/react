'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioGrid = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _formioUtils = require('formio-utils');

var _formioUtils2 = _interopRequireDefault(_formioUtils);

var _reactabular = require('reactabular');

var _Paginator = require('./Paginator');

var _Paginator2 = _interopRequireDefault(_Paginator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormioGrid = function (_React$Component) {
  _inherits(FormioGrid, _React$Component);

  function FormioGrid(props) {
    _classCallCheck(this, FormioGrid);

    var _this = _possibleConstructorReturn(this, (FormioGrid.__proto__ || Object.getPrototypeOf(FormioGrid)).call(this, props));

    _this.state = {
      columns: _this.columnsFromForm(props.form),
      submissions: _this.props.submissions || [],
      paginationPage: _this.props.paginationPage,
      paginationNumPage: _this.props.paginationNumPage,
      paginationSize: _this.props.paginationSize
    };

    _this.onRowClick = _this.onRowClick.bind(_this);
    _this.onPageChange = _this.onPageChange.bind(_this);
    _this.loadForm = _this.loadForm.bind(_this);
    _this.loadSubmissions = _this.loadSubmissions.bind(_this);
    return _this;
  }

  _createClass(FormioGrid, [{
    key: 'formatCell',
    value: function formatCell(value, _ref) {
      var column = _ref.column;

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        return value;
      }
      return '[Object]';
    }
  }, {
    key: 'columnsFromForm',
    value: function columnsFromForm(form) {
      var _this2 = this;

      var columns = [];
      if (form && form.components) {
        _formioUtils2.default.eachComponent(form.components, function (component) {
          if (component.input && component.tableView && component.key) {
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
                highlight: true,
                format: _this2.formatCell
              },
              visible: true
            });
          }
        });
      }
      return columns;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.form !== this.props.form) {
        this.setState({
          columns: this.columnsFromForm(nextProps.form)
        });
      }
      if (nextProps.submissions !== this.state.submissions) {
        this.setState({
          submissions: nextProps.submissions
        });
      }
      if (nextProps.paginationPage !== this.state.paginationPage) {
        this.setState({
          paginationPage: nextProps.paginationPage
        });
      }
      if (nextProps.paginationNumPage !== this.state.paginationNumPage) {
        this.setState({
          paginationNumPage: nextProps.paginationNumPage
        });
      }
      if (nextProps.paginationSize !== this.state.paginationSize) {
        this.setState({
          limit: nextProps.paginationSize
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.src) {
        this.formio = new _formiojs2.default(this.props.src);
        this.loadForm();
        this.loadSubmissions();
      }
    }
  }, {
    key: 'loadForm',
    value: function loadForm() {
      var _this3 = this;

      this.formio.loadForm().then(function (form) {
        _this3.setState({
          columns: _this3.columnsFromForm(form)
        });
      });
    }
  }, {
    key: 'loadSubmissions',
    value: function loadSubmissions() {
      var _this4 = this;

      this.formio.loadSubmissions({
        params: {
          limit: this.state.paginationSize,
          skip: (this.state.paginationPage - 1) * this.state.paginationSize
        }
      }).then(function (submissions) {
        _this4.setState({
          submissions: submissions,
          paginationNumPages: Math.ceil(submissions.serverCount / _this4.state.paginationSize)
        });
      });
    }
  }, {
    key: 'onRowClick',
    value: function onRowClick(row) {
      var _this5 = this;

      return {
        onClick: function onClick() {
          if (!_this5.props.buttons && typeof _this5.props.onButtonClick === 'function') {
            _this5.props.onButtonClick('row', row._id);
          }
        }
      };
    }
  }, {
    key: 'onPageChange',
    value: function onPageChange(page) {
      if (typeof this.props.onPageChange === 'function') {
        this.props.onPageChange(page);
      } else {
        this.setState({
          paginationPage: page
        }, this.loadSubmissions);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var rows = _reactabular.resolve.resolve({
        columns: this.state.columns,
        method: _reactabular.resolve.nested
      })(this.state.submissions);
      return _react2.default.createElement(
        'div',
        { className: 'table-responsive' },
        _react2.default.createElement(
          _reactabular.Table.Provider,
          {
            className: 'table table-striped table-bordered table-hover',
            columns: this.state.columns
          },
          _react2.default.createElement(_reactabular.Table.Header, null),
          _react2.default.createElement(_reactabular.Table.Body, {
            rows: rows,
            rowKey: '_id',
            onRow: this.onRowClick
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'controls' },
          _react2.default.createElement(_Paginator2.default, {
            paginationPage: this.state.paginationPage,
            paginationNumPages: this.state.paginationNumPages,
            onSelect: this.onPageChange
          })
        )
      );
    }
  }]);

  return FormioGrid;
}(_react2.default.Component);

FormioGrid.defaultProps = {
  form: {},
  submissions: [],
  paginationPage: 1,
  paginationNumPages: 1,
  paginationSizes: [25, 50, 75],
  paginationSize: 25
};

FormioGrid.propTypes = {
  src: _react2.default.PropTypes.string
};

exports.FormioGrid = FormioGrid;