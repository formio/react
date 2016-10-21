'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _factories = require('../factories');

var _reducers = require('../reducers');

var _auth = require('../views/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(_ref) {
    var appUrl = _ref.appUrl;
    var _ref$loginForm = _ref.loginForm;
    var loginForm = _ref$loginForm === undefined ? 'user/login' : _ref$loginForm;
    var _ref$registerForm = _ref.registerForm;
    var registerForm = _ref$registerForm === undefined ? 'user/register' : _ref$registerForm;
    var _ref$forceAuth = _ref.forceAuth;
    var forceAuth = _ref$forceAuth === undefined ? false : _ref$forceAuth;
    var _ref$authState = _ref.authState;
    var authState = _ref$authState === undefined ? '/' : _ref$authState;
    var _ref$anonState = _ref.anonState;
    var anonState = _ref$anonState === undefined ? '/auth' : _ref$anonState;
    var _ref$allowedStates = _ref.allowedStates;
    var allowedStates = _ref$allowedStates === undefined ? ['/auth'] : _ref$allowedStates;

    _classCallCheck(this, _class);

    this.Global = _auth.Global;
    this.Logout = _auth.Logout;
    this.Auth = _auth.Auth;

    this.appUrl = appUrl;
    this.loginForm = loginForm;
    this.registerForm = registerForm;
    this.forceAuth = forceAuth;
    this.authState = authState;
    this.anonState = anonState;
    this.allowedStates = !forceAuth || allowedStates;

    (0, _factories.addReducer)('auth', this.getReducers(this.appUrl));
    (0, _factories.addRoute)(this.getRoutes());
  }

  /**
   * Global is used to enforce "forceAuth" and will redirect if not logged in.
   *
   * @returns {{contextTypes, new(*=, *=): {render}}}
   * @constructor
   */


  _createClass(_class, [{
    key: 'getReducers',
    value: function getReducers(appUrl) {
      return (0, _reducers.authReducer)(appUrl);
    }
  }, {
    key: 'getRoutes',
    value: function getRoutes() {
      return _react2.default.createElement(
        'div',
        { className: 'formio-auth' },
        _react2.default.createElement(_reactRouter.Match, { pattern: '/', component: this.Global(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: '/logout', exactly: true, component: this.Logout(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.anonState, exactly: true, component: this.Auth(this) })
      );
    }
  }]);

  return _class;
}();

exports.default = _class;