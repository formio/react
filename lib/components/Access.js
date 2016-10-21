'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Access = undefined;

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

var Access = exports.Access = function (_React$Component) {
  _inherits(Access, _React$Component);

  function Access(props, context) {
    _classCallCheck(this, Access);

    var _this = _possibleConstructorReturn(this, (Access.__proto__ || Object.getPrototypeOf(Access)).call(this, props, context));

    _this.componentWillMount = function () {
      // Only subscribe if currentUser is set.
      if (_this.state.user) {
        _this.unsubscribe = _this.store.subscribe(_this.handleChange);
      }
    };

    _this.componentWillUnMount = function () {
      if (typeof _this.unsubscribe === 'function') {
        _this.unsubscribe();
      }
    };

    _this.handleChange = function () {
      var newUser = _this.store.getState().currentUser || false;
      if (!(0, _isEqual2.default)(_this.state.user, newUser)) {
        _this.setState({
          user: newUser
        });
      }
    };

    _this.hasAccess = function () {
      var _this$props = _this.props;
      var form = _this$props.form;
      var permissions = _this$props.permissions;


      if (!Array.isArray(permissions)) {
        permissions = [permissions];
      }

      var user = _this.state.user;
      // If no user, we aren't using auth system to assume access.

      if (!user) {
        return true;
      }

      // If access hasn't been initialized yet, don't allow access.
      if (!user.access) {
        return false;
      }

      var hasAccess = false;
      permissions.forEach(function (permission) {
        // Check that there are permissions.
        if (!user.access[permission]) {
          return false;
        }
        // Check for anonymous users. Must set anonRole.
        if (!$rootScope.user) {
          if (access[permission].indexOf(anonRole) !== -1) {
            hasAccess = true;
          }
        } else {
          // Check the user's roles for access.
          $rootScope.user.roles.forEach(function (role) {
            if (access[permission].indexOf(role) !== -1) {
              hasAccess = true;
            }
          });
        }
      });
      return hasAccess;
    };

    _this.render = function () {
      var children = _this.props.children;

      if (!_this.hasAccess()) {
        return null;
      }
      return children;
    };

    _this.store = context.store;
    _this.state = {
      user: _this.store.getState().currentUser || false
    };
    return _this;
  }

  return Access;
}(_react2.default.Component);

Access.contextTypes = {
  store: _storeShape2.default
};