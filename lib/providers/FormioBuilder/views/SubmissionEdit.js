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
        var src = _ref2.src,
            form = _ref2.form,
            submission = _ref2.submission,
            onFormSubmit = _ref2.onFormSubmit,
            params = _ref2.params;

        if (false && params['submissionId'] !== submission.submission._id) {
          return _react2.default.createElement(
            'div',
            { className: 'form-view' },
            'Loading...'
          );
        } else {
          return _react2.default.createElement(
            'div',
            { className: 'form-view' },
            _react2.default.createElement(_components.Formio, {
              src: src,
              form: form.form,
              submission: submission.submission,
              onFormSubmit: onFormSubmit
            })
          );
        }
      }, _this.mapStateToProps = function (_ref3, _ref4) {
        var formio = _ref3.formio;
        var params = _ref4.params;

        return {
          src: formio[builder.key].submission.src + '/form/' + params[builder.key + 'Id'] + '/submission/' + params['submissionId'],
          form: formio[builder.key].form,
          submission: formio[builder.key].submission
        };
      }, _this.mapDispatchToProps = function (dispatch, _ref5, router) {
        var params = _ref5.params;

        return {
          onFormSubmit: function onFormSubmit(submission) {
            router.transitionTo(builder.options.base + '/form/' + params[builder.key + 'Id'] + '/submission');
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }