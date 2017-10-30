'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Formio = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _full = require('formiojs/full');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Formio = exports.Formio = function (_Component) {
  _inherits(Formio, _Component);

  function Formio() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Formio);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Formio.__proto__ || Object.getPrototypeOf(Formio)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  return Formio;
}(_react.Component);

Formio.defaultProps = {
  options: {}
};
Formio.propTypes = {
  src: _propTypes2.default.string,
  form: _propTypes2.default.object,
  submission: _propTypes2.default.object,
  options: _propTypes2.default.shape({
    readOnly: _propTypes2.default.boolean,
    noAlerts: _propTypes2.default.boolean,
    i18n: _propTypes2.default.object,
    template: _propTypes2.default.string
  }),
  onPrevPage: _propTypes2.default.func,
  onNextPage: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onCustomEvent: _propTypes2.default.func,
  onSubmit: _propTypes2.default.func,
  onSubmitDone: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  onRender: _propTypes2.default.func
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.componentDidMount = function () {
    var _props = _this2.props,
        options = _props.options,
        src = _props.src,
        form = _props.form;


    if (src) {
      _this2.createPromise = _full.Formio.createForm(_this2.element, src, options).then(function (formio) {
        _this2.formio = formio;
        _this2.formio.src = src;
      });
    }
    if (form) {
      _this2.createPromise = _full.Formio.createForm(_this2.element, form, options).then(function (formio) {
        _this2.formio = formio;
        _this2.formio.form = form;
      });
    }

    _this2.initializeFormio();
  };

  this.componentWillUnmount = function () {
    if (_this2.formio !== undefined) {
      _this2.formio.destroy(true);
    }
  };

  this.initializeFormio = function () {
    if (_this2.createPromise) {
      _this2.createPromise.then(function () {
        if (_this2.props.submission) {
          _this2.formio.submission = _this2.props.submission;
        }
        //this.formio.hideComponents([]); (From Components.js)
        _this2.formio.on('prevPage', _this2.emit('onPrevPage'));
        _this2.formio.on('nextPage', _this2.emit('onNextPage'));
        _this2.formio.on('change', _this2.emit('onChange'));
        _this2.formio.on('customEvent', _this2.emit('onCustomEvent'));
        _this2.formio.on('submit', _this2.emit('onSubmit'));
        _this2.formio.on('submitDone', _this2.emit('onSubmitDone'));
        _this2.formio.on('error', _this2.emit('onError'));
        _this2.formio.on('render', _this2.emit('onRender'));
      });
    }
  };

  this.componentWillReceiveProps = function (nextProps) {
    var _props2 = _this2.props,
        options = _props2.options,
        src = _props2.src,
        form = _props2.form,
        submission = _props2.submission;


    if (src !== nextProps.src) {
      _this2.createPromise = _full.Formio.createForm(_this2.element, nextProps.src, options).then(function (formio) {
        _this2.formio = formio;
        _this2.formio.src = nextProps.src;
      });
      _this2.initializeFormio();
    }
    if (form !== nextProps.form) {
      _this2.createPromise = _full.Formio.createForm(_this2.element, nextProps.form, options).then(function (formio) {
        _this2.formio = formio;
        _this2.formio.form = form;
      });
      _this2.initializeFormio();
    }

    if (submission !== nextProps.submission && _this2.formio) {
      _this2.formio.submission = nextProps.submission;
    }
  };

  this.render = function () {
    return _react2.default.createElement('div', { ref: function ref(element) {
        return _this2.element = element;
      } });
  };

  this.emit = function (funcName) {
    return function () {
      if (_this2.props.hasOwnProperty(funcName) && typeof _this2.props[funcName] === 'function') {
        var _props3;

        (_props3 = _this2.props)[funcName].apply(_props3, arguments);
      }
    };
  };
};