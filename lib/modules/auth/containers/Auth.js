'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _FormioView2 = require('../../../FormioView');

var _FormioView3 = _interopRequireDefault(_FormioView2);

var _Login = require('./Login');

var _Login2 = _interopRequireDefault(_Login);

var _Register = require('./Register');

var _Register2 = _interopRequireDefault(_Register);

var _NavLink = require('../../../components/NavLink');

var _NavLink2 = _interopRequireDefault(_NavLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AuthView = function (_FormioView) {
  _inherits(AuthView, _FormioView);

  function AuthView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AuthView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AuthView.__proto__ || Object.getPrototypeOf(AuthView)).call.apply(_ref, [this].concat(args))), _this), _this.component = function (_Component) {
      _inherits(Auth, _Component);

      function Auth() {
        _classCallCheck(this, Auth);

        return _possibleConstructorReturn(this, (Auth.__proto__ || Object.getPrototypeOf(Auth)).apply(this, arguments));
      }

      _createClass(Auth, [{
        key: 'render',
        value: function render() {
          var _props = this.props,
              location = _props.location,
              Login = _props.Login,
              Register = _props.Register;
          var config = this.props.formio.auth.config;

          return location.pathname === '/' + config.path ? _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-lg-6 col-md-6' },
              _react2.default.createElement(
                'div',
                { className: 'panel panel-default login-container' },
                _react2.default.createElement(
                  'div',
                  { className: 'panel-heading' },
                  'Login'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'panel-body' },
                  _react2.default.createElement(Login, null)
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-lg-6 col-md-6' },
              _react2.default.createElement(
                'div',
                { className: 'panel panel-default register-container' },
                _react2.default.createElement(
                  'div',
                  { className: 'panel-heading' },
                  'Register'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'panel-body' },
                  _react2.default.createElement(Register, null)
                )
              )
            )
          ) : _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-6 col-md-offset-3' },
              _react2.default.createElement(
                'div',
                { className: 'panel panel-default' },
                _react2.default.createElement(
                  'div',
                  { className: 'panel-heading', style: { paddingBottom: 0, borderBottom: 'none' } },
                  _react2.default.createElement(
                    'ul',
                    { className: 'nav nav-tabs', style: { borderBottom: 'none' } },
                    _react2.default.createElement(
                      _NavLink2.default,
                      { to: '/' + config.path + '/login' },
                      'Login'
                    ),
                    _react2.default.createElement(
                      _NavLink2.default,
                      { to: '/' + config.path + '/register' },
                      'Register'
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'panel-body' },
                  _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                      'div',
                      { className: 'col-lg-12' },
                      this.props.children
                    )
                  )
                )
              )
            )
          );
        }
      }]);

      return Auth;
    }(_react.Component), _this.mapStateToProps = function () {
      return {
        Login: _this.formio.auth.config.Login || _Login2.default,
        Register: _this.formio.auth.config.Register || _Register2.default
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return AuthView;
}(_FormioView3.default);

exports.default = AuthView;