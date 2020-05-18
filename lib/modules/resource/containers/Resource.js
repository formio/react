'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioView2 = require('../../../FormioView');

var _FormioView3 = _interopRequireDefault(_FormioView2);

var _NavLink = require('../../../components/NavLink');

var _NavLink2 = _interopRequireDefault(_NavLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (config) {
  return function (_FormioView) {
    _inherits(Resource, _FormioView);

    function Resource() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Resource);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Resource.__proto__ || Object.getPrototypeOf(Resource)).call.apply(_ref, [this].concat(args))), _this), _this.component = function (props) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'ul',
            { className: 'nav nav-tabs' },
            _react2.default.createElement(
              _NavLink2.default,
              { exact: true, to: props.basePath + config.name + '/' + props.params[config.name + 'Id'], role: 'presentation' },
              'View'
            ),
            _react2.default.createElement(
              _NavLink2.default,
              { to: props.basePath + config.name + '/' + props.params[config.name + 'Id'] + '/edit', role: 'presentation' },
              'Edit'
            ),
            _react2.default.createElement(
              _NavLink2.default,
              { to: props.basePath + config.name + '/' + props.params[config.name + 'Id'] + '/delete', role: 'presentation' },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-trash' })
            )
          ),
          props.children
        );
      }, _this.initialize = function (_ref2) {
        var dispatch = _ref2.dispatch;

        var resource = _this.formio.resources[config.name];
        dispatch(resource.actions.submission.get(_this.props.params[config.name + 'Id']));
      }, _this.mapStateToProps = function (state, ownProps) {
        var resource = _this.formio.resources[config.name];
        return {
          basePath: resource.getBasePath(ownProps.params)
        };
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Resource;
  }(_FormioView3.default);
};