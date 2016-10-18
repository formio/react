'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _storeShape = require('react-redux/lib/utils/storeShape');

var _storeShape2 = _interopRequireDefault(_storeShape);

var _reactRouter = require('react-router');

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class(props, context) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

    _this.componentWillMount = function () {
      if (typeof _this.init === 'function') {
        _this.init(_this.store, _this.props, _this.router);
      }
    };

    _this.componentWillReceiveProps = function (_ref) {
      var params = _ref.params;

      // If params have changed we are on a new page.
      if (!(0, _util.deepEqual)(params, _this.props.params) && typeof _this.init === 'function') {
        _this.init(_this.store, _this.props, _this.router);
      }
    };

    _this.render = function () {
      var Component = (0, _reactRedux.connect)(_this.mapStateToProps,
      // Adds router to the end of mapDispatchToProps.
      function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this.mapDispatchToProps.apply(_this, args.concat([_this.router]));
      })(_this.container);
      return _react2.default.createElement(Component, _this.props);
    };

    _this.router = context.router;
    _this.store = context.store;
    return _this;
  }

  return _class;
}(_react2.default.Component);

_class.contextTypes = {
  router: _reactRouter.propTypes.routerContext,
  store: _storeShape2.default
};
exports.default = _class;