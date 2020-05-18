'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Form = require('../../../components/Form');

var _Form2 = _interopRequireDefault(_Form);

var _FormioView2 = require('../../../FormioView');

var _FormioView3 = _interopRequireDefault(_FormioView2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginView = function (_FormioView) {
  _inherits(LoginView, _FormioView);

  function LoginView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, LoginView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LoginView.__proto__ || Object.getPrototypeOf(LoginView)).call.apply(_ref, [this].concat(args))), _this), _this.component = function (props) {
      return _react2.default.createElement(_Form2.default, props);
    }, _this.mapStateToProps = function () {
      return {
        src: _this.formio.config.projectUrl + '/' + _this.formio.auth.config.login.form
      };
    }, _this.mapDispatchToProps = function (dispatch) {
      return {
        onSubmitDone: function onSubmitDone(submission) {
          _this.router.push('/' + _this.formio.auth.config.authState);
          dispatch(_this.formio.auth.actions.setUser(submission));
        }
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return LoginView;
}(_FormioView3.default);

exports.default = LoginView;