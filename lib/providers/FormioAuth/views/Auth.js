'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (auth) {
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
        var onFormSubmit = _ref2.onFormSubmit;

        var loginForm = null;
        var registerForm = null;
        if (auth.loginForm) {
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
                  _react2.default.createElement(_components.Formio, { src: auth.appUrl + '/' + auth.loginForm, onFormSubmit: onFormSubmit })
                )
              )
            )
          );
        }
        if (auth.registerForm) {
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
                  _react2.default.createElement(_components.Formio, { src: auth.appUrl + '/' + auth.registerForm, onFormSubmit: onFormSubmit })
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
      }, _this.mapDispatchToProps = function (dispatch, ownProps, router) {
        return {
          onFormSubmit: function onFormSubmit() {
            dispatch(_actions.UserActions.fetch());
            router.transitionTo(auth.authState);
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

var _reactRouter = require('react-router');

var _components = require('../../../components');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }