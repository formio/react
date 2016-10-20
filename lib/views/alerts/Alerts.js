'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (alerts) {
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
        var alerts = _ref2.alerts;

        if (!alerts) {
          return null;
        }
        return _react2.default.createElement(
          'div',
          { className: 'formio-alerts' },
          alerts.map(function (alert, index) {
            return _react2.default.createElement(
              'div',
              { key: index, className: "alert alert-" + alert.type, role: 'alert' },
              alert.message
            );
          })
        );
      }, _this.terminate = function (_ref3) {
        var dispatch = _ref3.dispatch;
        var getState = _ref3.getState;

        var _getState = getState();

        var formio = _getState.formio;

        if (formio.alerts && formio.alerts.alerts.length) {
          dispatch(_actions.AlertActions.reset());
        }
      }, _this.mapStateToProps = function (_ref4) {
        var formio = _ref4.formio;

        return {
          alerts: formio.alerts.alerts
        };
      }, _this.mapDispatchToProps = null, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return _class2;
  }(_reduxView2.default);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxView = require('redux-view');

var _reduxView2 = _interopRequireDefault(_reduxView);

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }