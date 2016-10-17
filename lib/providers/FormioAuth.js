'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _FormioProvider2 = require('./FormioProvider');

var _FormioProvider3 = _interopRequireDefault(_FormioProvider2);

var _components = require('../components');

var _actions = require('../actions');

var _factories = require('../factories');

var _reducers = require('../reducers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_FormioProvider) {
  _inherits(_class, _FormioProvider);

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

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

    _initialiseProps.call(_this);

    _this.appUrl = appUrl;
    _this.loginForm = loginForm;
    _this.registerForm = registerForm;
    _this.forceAuth = forceAuth;
    _this.authState = authState;
    _this.anonState = anonState;
    _this.allowedStates = !forceAuth || allowedStates;

    (0, _factories.addReducer)('currentUser', _this.getReducers());
    (0, _factories.addRoute)(_this.getRoutes());
    return _this;
  }

  /**
   * This is a crazy workaround to force any state transitions to either be authenticated or in allowedStates.
   *
   * @returns {{contextTypes, new(*=, *=): {render}}}
   * @constructor
   */


  _createClass(_class, [{
    key: 'getReducers',
    value: function getReducers() {
      return (0, _reducers.userReducer)();
    }
  }, {
    key: 'getRoutes',
    value: function getRoutes() {
      return _react2.default.createElement(
        'div',
        { className: 'formio-auth' },
        _react2.default.createElement(_reactRouter.Match, { pattern: '/', component: this.Global() }),
        _react2.default.createElement(_reactRouter.Match, { pattern: '/logout', exactly: true, component: this.Logout() }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.anonState, exactly: true, component: this.Auth() })
      );
    }
  }]);

  return _class;
}(_FormioProvider3.default);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.Global = function () {
    return _this2.connectComponent({
      container: function (_React$Component) {
        _inherits(container, _React$Component);

        function container() {
          var _ref2;

          var _temp, _this3, _ret;

          _classCallCheck(this, container);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref2 = container.__proto__ || Object.getPrototypeOf(container)).call.apply(_ref2, [this].concat(args))), _this3), _this3.render = function () {
            var _this3$props = _this3.props;
            var shouldRedirect = _this3$props.shouldRedirect;
            var to = _this3$props.to;

            if (shouldRedirect) {
              return _react2.default.createElement(_reactRouter.Redirect, { to: to });
            } else {
              return null;
            }
          }, _temp), _possibleConstructorReturn(_this3, _ret);
        }

        return container;
      }(_react2.default.Component),
      mapStateToProps: function mapStateToProps(state, _ref3) {
        var location = _ref3.location;
        var currentUser = state.formio.currentUser;

        console.log(currentUser);
        console.log(_this2.forceAuth, _this2.allowedStates.length, currentUser.init, !currentUser.isFetching, !currentUser.user, !_this2.allowedStates.includes(location.pathname));
        return {
          shouldRedirect: _this2.forceAuth && _this2.allowedStates.length && currentUser.init && !currentUser.isFetching && !currentUser.user && !_this2.allowedStates.includes(location.pathname),
          to: _this2.anonState
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        dispatch(_actions.UserActions.fetch());
        return {};
      }
    });
  };

  this.Logout = function () {
    return _this2.connectComponent({
      container: _reactRouter.Redirect,
      mapStateToProps: function mapStateToProps() {
        return {
          to: _this2.anonState
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        dispatch(_actions.UserActions.logout());
        return {};
      }
    });
  };

  this.Auth = function () {
    return _this2.connectComponent({
      container: function container(_ref4) {
        var onFormSubmit = _ref4.onFormSubmit;

        var loginForm = null;
        var registerForm = null;
        if (_this2.loginForm) {
          loginForm = _react2.default.createElement(
            'div',
            { className: 'panel panel-default' },
            _react2.default.createElement(
              'div',
              { className: 'panel-heading' },
              _react2.default.createElement(
                'h3',
                { className: 'panel-title' },
                'Login'
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
                  _react2.default.createElement(_components.Formio, { src: _this2.appUrl + '/' + _this2.loginForm, onFormSubmit: onFormSubmit })
                )
              )
            )
          );
        }
        if (_this2.registerForm) {
          registerForm = _react2.default.createElement(
            'div',
            { className: 'panel panel-default' },
            _react2.default.createElement(
              'div',
              { className: 'panel-heading' },
              _react2.default.createElement(
                'h3',
                { className: 'panel-title' },
                'Register'
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
                  _react2.default.createElement(_components.Formio, { src: _this2.appUrl + '/' + _this2.registerForm, onFormSubmit: onFormSubmit })
                )
              )
            )
          );
        }

        if (loginForm && registerForm) {
          loginForm = _react2.default.createElement(
            'div',
            { className: 'col-md-6' },
            loginForm
          );
          registerForm = _react2.default.createElement(
            'div',
            { className: 'col-md-6' },
            registerForm
          );
        } else {
          if (loginForm) {
            loginForm = _react2.default.createElement(
              'div',
              { className: 'col-md-8 col-md-offset-2' },
              loginForm
            );
          }
          if (registerForm) {
            registerForm = _react2.default.createElement(
              'div',
              { className: 'col-md-8 col-md-offset-2' },
              registerForm
            );
          }
        }

        return _react2.default.createElement(
          'div',
          { className: 'formio-auth' },
          loginForm,
          registerForm
        );
      },
      mapStateToProps: null,
      mapDispatchToProps: function mapDispatchToProps(dispatch, ownProps, router) {
        return {
          onFormSubmit: function onFormSubmit() {
            dispatch(_actions.UserActions.fetch());
            router.transitionTo(_this2.authState);
          }
        };
      }
    });
  };
};

exports.default = _class;