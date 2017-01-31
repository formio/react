'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioLogout = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormioLogout = exports.FormioLogout = function (_React$Component) {
  _inherits(FormioLogout, _React$Component);

  function FormioLogout() {
    _classCallCheck(this, FormioLogout);

    return _possibleConstructorReturn(this, (FormioLogout.__proto__ || Object.getPrototypeOf(FormioLogout)).apply(this, arguments));
  }

  _createClass(FormioLogout, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var Logout = (0, _reactRedux.connect)(function (state) {
        if (state.formio && state.formio.auth) {
          return {
            auth: state.formio.auth.user
          };
        } else {
          return {
            auth: false
          };
        }
      }, function (dispatch) {
        return {
          onClick: function onClick() {
            dispatch(_actions.UserActions.logout());
            if (typeof _this2.props.onLogout === 'function') {
              _this2.props.onLogout(dispatch);
            }
          }
        };
      })(function (_ref) {
        var user = _ref.user,
            _onClick = _ref.onClick;

        if (!user) {
          return null;
        } else {
          return _react2.default.createElement(
            'a',
            { onClick: function onClick() {
                _onClick();
              } },
            _this2.props.children
          );
        }
      });
      return _react2.default.createElement(
        Logout,
        null,
        this.props.children
      );
    }
  }]);

  return FormioLogout;
}(_react2.default.Component);

FormioLogout.propTypes = {
  onLogout: _react2.default.PropTypes.func
};