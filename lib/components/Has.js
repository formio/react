'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Has = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storeShape = require('react-redux/lib/utils/storeShape');

var _storeShape2 = _interopRequireDefault(_storeShape);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Has = exports.Has = function (_React$Component) {
  _inherits(Has, _React$Component);

  function Has(props, context) {
    _classCallCheck(this, Has);

    var _this = _possibleConstructorReturn(this, (Has.__proto__ || Object.getPrototypeOf(Has)).call(this, props, context));

    _this.componentWillMount = function () {
      // Only subscribe if auth is set.
      if (_this.state.auth) {
        _this.unsubscribe = _this.store.subscribe(_this.handleChange);
      }
    };

    _this.componentWillUnMount = function () {
      if (typeof _this.unsubscribe === 'function') {
        _this.unsubscribe();
      }
    };

    _this.handleChange = function () {
      var newUser = _this.store.getState().formio.auth || false;
      if (!(0, _isEqual2.default)(_this.state.auth, newUser)) {
        _this.setState({
          auth: newUser
        });
      }
    };

    _this.hasAccess = function () {
      var _this$props = _this.props;
      var to = _this$props.to;
      var permission = _this$props.permission;
      var _this$props$type = _this$props.type;
      var type = _this$props$type === undefined ? 'submissionAccess' : _this$props$type;
      var auth = _this.state.auth;

      // If not checking permission access.

      if (!to || !permissions) {
        return false;
      }

      // If access hasn't been initialized yet, don't allow access.
      if (!auth[type] || !auth[type][to]) {
        return false;
      }

      var permissions = permission;
      if (!Array.isArray(permissions)) {
        permissions = [permissions];
      }

      var hasAccess = false;
      permissions.forEach(function (permission) {
        // Check that there are permissions.
        if (!auth[type][to][permission]) {
          return false;
        }
        // Check for anonymous users.
        if (!auth.user) {
          if (auth[type][to][permission].indexOf(auth.roles.anonymous._id) !== -1) {
            hasAccess = true;
          }
        } else {
          // Check the user's roles for access.
          auth.user.roles.forEach(function (role) {
            if (user[type][to][permission].indexOf(role) !== -1) {
              hasAccess = true;
            }
          });
        }
      });
      return hasAccess;
    };

    _this.hasRole = function () {
      var role = _this.props.role;
      var auth = _this.state.auth;

      // If not using role check.

      if (!role) {
        return false;
      }

      // Ensure roles is an array.
      var roles = role;
      if (!Array.isArray(roles)) {
        roles = [roles];
      }
      // Lowercase all the names.
      roles = roles.map(function (role) {
        return role.toLowerCase();
      });

      // Check for anonymous users differently.
      if (!auth.user) {
        return roles.indexOf('anonymous') !== -1;
      }

      var hasRole = false;
      roles.forEach(function (role) {
        if (auth.roles[role] && auth.user.roles.indexOf(auth.roles[role]._id) !== -1) {
          hasRole = true;
        }
      });
      return hasRole;
    };

    _this.render = function () {
      var children = _this.props.children;
      var auth = _this.state.auth;

      // If auth but no access, return nothing.

      if (!!auth && !_this.hasAccess() && !_this.hasRole()) {
        return null;
      }
      return children;
    };

    _this.store = context.store;
    _this.state = {
      auth: _this.store.getState().formio.auth || false
    };
    return _this;
  }

  return Has;
}(_react2.default.Component);

Has.contextTypes = {
  store: _storeShape2.default
};