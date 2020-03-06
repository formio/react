'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _eventemitter = require('eventemitter2');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _components = require('formiojs/components');

var _components2 = _interopRequireDefault(_components);

var _Components = require('formiojs/components/Components');

var _Components2 = _interopRequireDefault(_Components);

var _Form = require('formiojs/Form');

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_Components2.default.setComponents(_components2.default);

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Form);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Form, null, [{
    key: 'getDefaultEmitter',
    value: function getDefaultEmitter() {
      return new _eventemitter2.default({
        wildcard: false,
        maxListeners: 0
      });
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  src: _propTypes2.default.string,
  url: _propTypes2.default.string,
  form: _propTypes2.default.object,
  submission: _propTypes2.default.object,
  options: _propTypes2.default.shape({
    readOnly: _propTypes2.default.boolean,
    noAlerts: _propTypes2.default.boolean,
    i18n: _propTypes2.default.object,
    template: _propTypes2.default.string,
    saveDraft: _propTypes2.default.boolean
  }),
  onPrevPage: _propTypes2.default.func,
  onNextPage: _propTypes2.default.func,
  onCancel: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onCustomEvent: _propTypes2.default.func,
  onComponentChange: _propTypes2.default.func,
  onSubmit: _propTypes2.default.func,
  onSubmitDone: _propTypes2.default.func,
  onFormLoad: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  onRender: _propTypes2.default.func,
  onAttach: _propTypes2.default.func,
  onBuild: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onInitialized: _propTypes2.default.func,
  formioform: _propTypes2.default.any
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.componentDidMount = function () {
    var _props = _this2.props,
        _props$options = _props.options,
        options = _props$options === undefined ? {} : _props$options,
        src = _props.src,
        url = _props.url,
        form = _props.form;


    if (!options.events) {
      options.events = Form.getDefaultEmitter();
    }

    if (src) {
      _this2.instance = new (_this2.props.formioform || _Form2.default)(_this2.element, src, options);
      _this2.createPromise = _this2.instance.ready.then(function (formio) {
        _this2.formio = formio;
        _this2.formio.src = src;
      });
    }
    if (form) {
      _this2.instance = new (_this2.props.formioform || _Form2.default)(_this2.element, form, options);
      _this2.createPromise = _this2.instance.ready.then(function (formio) {
        _this2.formio = formio;
        _this2.formio.form = form;
        if (url) {
          _this2.formio.url = url;
        }

        return _this2.formio;
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
      _this2.instance.onAny(function (event) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        if (event.startsWith('formio.')) {
          var funcName = 'on' + event.charAt(7).toUpperCase() + event.slice(8);
          if (_this2.props.hasOwnProperty(funcName) && typeof _this2.props[funcName] === 'function') {
            var _props2;

            (_props2 = _this2.props)[funcName].apply(_props2, args);
          }
        }
      });
      _this2.createPromise.then(function () {
        if (_this2.props.submission) {
          _this2.formio.submission = _this2.props.submission;
        }
      });
    }
  };

  this.componentWillReceiveProps = function (nextProps) {
    var _props3 = _this2.props,
        _props3$options = _props3.options,
        options = _props3$options === undefined ? {} : _props3$options,
        src = _props3.src,
        form = _props3.form,
        submission = _props3.submission;


    if (!options.events) {
      options.events = Form.getDefaultEmitter();
    }

    if (src !== nextProps.src) {
      _this2.instance = new (_this2.props.formioform || _Form2.default)(_this2.element, nextProps.src, options);
      _this2.createPromise = _this2.instance.ready.then(function (formio) {
        _this2.formio = formio;
        _this2.formio.src = nextProps.src;
      });
      _this2.initializeFormio();
    }
    if (form !== nextProps.form) {
      _this2.instance = new (_this2.props.formioform || _Form2.default)(_this2.element, nextProps.form, options);
      _this2.createPromise = _this2.instance.ready.then(function (formio) {
        _this2.formio = formio;
        _this2.formio.form = nextProps.form;
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
};

exports.default = Form;