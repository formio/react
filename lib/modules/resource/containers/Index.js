'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioView2 = require('../../../FormioView');

var _FormioView3 = _interopRequireDefault(_FormioView2);

var _reactRouter = require('react-router');

var _SubmissionGrid = require('../../submission/containers/SubmissionGrid');

var _SubmissionGrid2 = _interopRequireDefault(_SubmissionGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (config) {
  return function (_FormioView) {
    _inherits(_class2, _FormioView);

    function _class2() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args))), _this), _this.query = {}, _this.page = 0, _this.component = function (_ref2) {
        var basePath = _ref2.basePath,
            form = _ref2.form,
            submissions = _ref2.submissions,
            limit = _ref2.limit,
            page = _ref2.page,
            sortOrder = _ref2.sortOrder,
            isLoading = _ref2.isLoading,
            onSort = _ref2.onSort,
            onPage = _ref2.onPage,
            onRowClick = _ref2.onRowClick;

        if (isLoading) {
          return _react2.default.createElement(
            'div',
            { className: 'form-index' },
            'Loading...'
          );
        } else {
          return _react2.default.createElement(
            'div',
            { className: 'form-index' },
            _react2.default.createElement(_SubmissionGrid2.default, {
              submissions: submissions,
              form: form,
              limit: limit,
              page: page,
              sortOrder: sortOrder,
              onSort: onSort,
              onPage: onPage,
              onRowClick: onRowClick
            }),
            _react2.default.createElement(
              _reactRouter.Link,
              { className: 'btn btn-primary', to: basePath + config.name + '/new' },
              _react2.default.createElement('i', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
              'New ',
              form.title
            )
          );
        }
      }, _this.initialize = function (_ref3, _ref4) {
        var dispatch = _ref3.dispatch;
        var params = _ref4.params;

        if (config.parents.length) {
          config.parents.forEach(function (parent) {
            if (params[parent + 'Id']) {
              _this.query['data.' + parent + '._id'] = params[parent + 'Id'];
            }
          });
        }
        dispatch(_this.formio.resources[config.name].actions.submission.index(0, _this.query));
      }, _this.mapStateToProps = function (state, ownProps) {
        var resource = _this.formio.resources[config.name];
        var form = resource.selectors.getForm(state);
        var submissions = resource.selectors.getSubmissions(state);

        return {
          basePath: resource.getBasePath(ownProps.params),
          form: form.form,
          submissions: submissions.submissions,
          page: submissions.page,
          limit: submissions.limit,
          sortOrder: _this.query.sort,
          isLoading: form.isFetching || submissions.isFetching
        };
      }, _this.toggleSort = function (field) {
        if (!_this.query.sort) {
          return _this.query.sort = field;
        }
        var currentSort = _this.query.sort[0] === '-' ? _this.query.sort.slice(1, _this.query.sort.length) : _this.query.sort;
        if (currentSort !== field) {
          _this.query.sort = field;
        } else if (_this.query.sort[0] !== '-') {
          _this.query.sort = '-' + field;
        } else {
          delete _this.query.sort;
        }
      }, _this.mapDispatchToProps = function (dispatch, ownProps) {
        var resource = _this.formio.resources[config.name];
        return {
          onSort: function onSort(col) {
            _this.toggleSort(col);
            dispatch(_this.formio.resources[config.name].actions.submission.index(_this.page, _this.query));
          },
          onPage: function onPage(page) {
            _this.page = page - 1;
            dispatch(_this.formio.resources[config.name].actions.submission.index(_this.page, _this.query));
          },
          onRowClick: function onRowClick(submission) {
            _this.router.push(resource.getBasePath(ownProps.params) + config.name + '/' + submission._id);
          }
        };
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return _class2;
  }(_FormioView3.default);
};