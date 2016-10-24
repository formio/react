'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (builder) {
  return function (_ReduxView) {
    _inherits(_class2, _ReduxView);

    function _class2() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args))), _this), _this.container = function (_ref2) {
        var form = _ref2.form;
        var submissions = _ref2.submissions;
        var pagination = _ref2.pagination;
        var limit = _ref2.limit;
        var isFetching = _ref2.isFetching;
        var onSortChange = _ref2.onSortChange;
        var onPageChange = _ref2.onPageChange;
        var onButtonClick = _ref2.onButtonClick;

        if (isFetching) {
          return _react2.default.createElement(
            'div',
            { className: 'form-index' },
            'Loading...'
          );
        } else {
          return _react2.default.createElement(
            'div',
            { className: 'form-index' },
            _react2.default.createElement(_components.FormioGrid, {
              submissions: submissions,
              form: form,
              onSortChange: onSortChange,
              onPageChange: onPageChange,
              pagination: pagination,
              limit: limit,
              onButtonClick: onButtonClick
            })
          );
        }
      }, _this.initialize = function (_ref3, _ref4) {
        var dispatch = _ref3.dispatch;
        var params = _ref4.params;

        dispatch(_actions.SubmissionActions.index(builder.key, 1, params[builder.key + 'Id']));
      }, _this.mapStateToProps = function (_ref5) {
        var formio = _ref5.formio;

        return {
          form: formio[builder.key].form.form,
          submissions: formio[builder.key].submissions.submissions,
          pagination: formio[builder.key].submissions.pagination,
          limit: formio[builder.key].submissions.limit,
          isFetching: formio[builder.key].submissions.isFetching
        };
      }, _this.mapDispatchToProps = function (dispatch, _ref6, router) {
        var params = _ref6.params;

        var formId = params[builder.key + 'Id'];
        return {
          onSortChange: function onSortChange() {},
          onPageChange: function onPageChange(page) {
            dispatch(_actions.SubmissionActions.index(builder.key, page, formId));
          },
          onButtonClick: function onButtonClick(button, submissionId) {
            switch (button) {
              case 'row':
              case 'view':
                router.transitionTo(builder.options.base + '/form/' + formId + '/submission/' + submissionId);
                break;
              case 'edit':
                router.transitionTo(builder.options.base + '/form/' + formId + '/submission/' + submissionId + '/edit');
                break;
              case 'delete':
                router.transitionTo(builder.options.base + '/form/' + formId + '/submission/' + submissionId + '/delete');
                break;
            }
          }
        };
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return _class2;
  }(_reduxView2.default);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxView = require('redux-view');

var _reduxView2 = _interopRequireDefault(_reduxView);

var _components = require('../../components');

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }