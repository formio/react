'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _storeShape = require('react-redux/lib/utils/storeShape');

var _storeShape2 = _interopRequireDefault(_storeShape);

var _reactRouter = require('react-router');

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, [{
    key: 'connectView',

    /**
     * This method does two things.
     *
     * 1. Get the router out of context and add it as an argument to mapDispatchToProps so that we can do router
     *    navigation as a result of functions passed into a Component.
     *
     * 2. Wrap the component using Redux so that mapStateToProps and mapDispatchToProps is called on it.
     *
     * @param component
     * @returns {{contextTypes, new(*=, *=): {render}}}
     */
    value: function connectView(component) {
      var _class2, _temp;

      return _temp = _class2 = function (_React$Component) {
        _inherits(_class2, _React$Component);

        function _class2(props, context) {
          _classCallCheck(this, _class2);

          var _this = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props, context));

          _this.componentWillMount = function () {
            if (typeof component.init === 'function') {
              component.init(_this.props, _this.store, _this.router);
            }
          };

          _this.componentWillReceiveProps = function (_ref) {
            var params = _ref.params;

            // If params have changed we are on a new page.
            if (!(0, _util.deepEqual)(params, _this.props.params) && typeof component.init === 'function') {
              component.init(_this.props, _this.store, _this.router);
            }
          };

          _this.render = function () {
            var Connected = (0, _reactRedux.connect)(component.mapStateToProps,
            // Adds router to the end of mapDispatchToProps.
            function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return component.mapDispatchToProps.apply(component, args.concat([_this.router]));
            })(component.container);
            return _react2.default.createElement(Connected, _this.props);
          };

          _this.router = context.router;
          _this.store = context.store;
          return _this;
        }

        return _class2;
      }(_react2.default.Component), _class2.contextTypes = {
        router: _reactRouter.propTypes.routerContext,
        store: _storeShape2.default
      }, _temp;
    }
  }]);

  return _class;
}();

exports.default = _class;