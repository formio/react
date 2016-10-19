'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (auth) {
  return function (_FormioView) {
    _inherits(_class2, _FormioView);

    function _class2() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args))), _this), _this.container = function (_ref2) {
        var shouldRedirect = _ref2.shouldRedirect;
        var to = _ref2.to;

        if (shouldRedirect) {
          return _react2.default.createElement(_reactRouter.Redirect, { to: to });
        } else {
          return null;
        }
      }, _this.initialize = function (store) {
        var _store$getState = store.getState();

        var formio = _store$getState.formio;

        if (!formio.currentUser.init) {
          store.dispatch(_actions.UserActions.fetch());
        }
      }, _this.mapStateToProps = function (state, _ref3) {
        var location = _ref3.location;
        var currentUser = state.formio.currentUser;

        return {
          shouldRedirect: auth.forceAuth && auth.allowedStates.length && currentUser.init && !currentUser.isFetching && !currentUser.user && !auth.allowedStates.includes(location.pathname),
          to: auth.anonState
        };
      }, _this.mapDispatchToProps = null, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return _class2;
  }(_components.FormioView);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _components = require('../../components');

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }