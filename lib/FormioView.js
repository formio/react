'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reduxView = require('redux-view');

var _reduxView2 = _interopRequireDefault(_reduxView);

var _formioConnect = require('./formioConnect');

var _formioConnect2 = _interopRequireDefault(_formioConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormioView = function (_ReduxView) {
  _inherits(FormioView, _ReduxView);

  function FormioView(props, context) {
    _classCallCheck(this, FormioView);

    var _this = _possibleConstructorReturn(this, (FormioView.__proto__ || Object.getPrototypeOf(FormioView)).call(this, props, context));

    _this.connect = _formioConnect2.default;

    _this.router = context.router;
    _this.formio = context.formio;
    return _this;
  }

  return FormioView;
}(_reduxView2.default);

FormioView.contextTypes = {
  router: _propTypes2.default.object,
  formio: _propTypes2.default.object,
  store: _propTypes2.default.object
};
exports.default = FormioView;