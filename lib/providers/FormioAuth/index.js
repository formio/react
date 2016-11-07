'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioAuth = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _components = require('./components');

Object.keys(_components).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _components[key];
    }
  });
});

var _views = require('./views');

Object.keys(_views).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _views[key];
    }
  });
});

var _actions = require('./actions');

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});

var _reducers = require('./reducers');

Object.keys(_reducers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reducers[key];
    }
  });
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reduxInjector = require('redux-injector');

var _factories = require('../../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormioAuth = exports.FormioAuth = function () {
  function FormioAuth(_ref) {
    var appUrl = _ref.appUrl,
        _ref$loginForm = _ref.loginForm,
        loginForm = _ref$loginForm === undefined ? 'user/login' : _ref$loginForm,
        _ref$registerForm = _ref.registerForm,
        registerForm = _ref$registerForm === undefined ? 'user/register' : _ref$registerForm,
        _ref$forceAuth = _ref.forceAuth,
        forceAuth = _ref$forceAuth === undefined ? false : _ref$forceAuth,
        _ref$authState = _ref.authState,
        authState = _ref$authState === undefined ? '/' : _ref$authState,
        _ref$anonState = _ref.anonState,
        anonState = _ref$anonState === undefined ? '/auth' : _ref$anonState,
        _ref$allowedStates = _ref.allowedStates,
        allowedStates = _ref$allowedStates === undefined ? ['/auth'] : _ref$allowedStates;

    _classCallCheck(this, FormioAuth);

    this.Global = _views.Global;
    this.Logout = _views.Logout;
    this.Auth = _views.Auth;

    this.appUrl = appUrl;
    this.loginForm = loginForm;
    this.registerForm = registerForm;
    this.forceAuth = forceAuth;
    this.authState = authState;
    this.anonState = anonState;
    this.allowedStates = !forceAuth || allowedStates;

    var reducer = this.getReducers(this.appUrl);
    (0, _reduxInjector.injectReducer)('formio.auth', reducer);
    (0, _factories.addReducer)('auth', reducer);
    (0, _factories.addRoute)(this.getRoutes());
  }

  /**
   * Global is used to enforce "forceAuth" and will redirect if not logged in.
   *
   * @returns {{contextTypes, new(*=, *=): {render}}}
   * @constructor
   */


  _createClass(FormioAuth, [{
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

  return FormioAuth;
}();