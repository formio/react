'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioView2 = require('../../../FormioView');

var _FormioView3 = _interopRequireDefault(_FormioView2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (config) {
  return function (_FormioView) {
    _inherits(Delete, _FormioView);

    function Delete() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Delete);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Delete.__proto__ || Object.getPrototypeOf(Delete)).call.apply(_ref, [this].concat(args))), _this), _this.component = function (props) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'h3',
            null,
            'Are you sure you wish to delete this record?'
          ),
          _react2.default.createElement(
            'div',
            { className: 'btn-toolbar' },
            _react2.default.createElement(
              'span',
              { onClick: props.onYes, className: 'btn btn-danger' },
              'Yes'
            ),
            _react2.default.createElement(
              'span',
              { onClick: props.onNo, className: 'btn btn-default' },
              'No'
            )
          )
        );
      }, _this.mapDispatchToProps = function (dispatch, ownProps) {
        var resource = _this.formio.resources[config.name];
        return {
          onYes: function onYes() {
            dispatch(resource.actions.submission.delete(ownProps.params[config.name + 'Id']));
            _this.router.push(resource.getBasePath(ownProps.params) + config.name);
          },
          onNo: _this.router.goBack
        };
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Delete;
  }(_FormioView3.default);
};