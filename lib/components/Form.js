'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

_Components2.default.setComponents(_components2.default);


var Form = function Form(props) {
  var instance = void 0;
  var createPromise = void 0;
  var element = void 0;
  var formio = void 0;

  (0, _react.useEffect)(function () {
    return function () {
      return formio ? formio.destroy(true) : null;
    };
  }, [formio]);

  var createWebformInstance = function createWebformInstance(srcOrForm) {
    var _props$options = props.options,
        options = _props$options === undefined ? {} : _props$options,
        formioform = props.formioform;

    instance = new (formioform || _Form2.default)(element, srcOrForm, options);
    createPromise = instance.ready.then(function (formioInstance) {
      formio = formioInstance;
    });

    return createPromise;
  };

  var onAnyEvent = function onAnyEvent(event) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (event.startsWith('formio.')) {
      var funcName = 'on' + event.charAt(7).toUpperCase() + event.slice(8);
      if (props.hasOwnProperty(funcName) && typeof props[funcName] === 'function') {
        props[funcName].apply(props, args);
      }
    }
  };

  var initializeFormio = function initializeFormio() {
    var submission = props.submission;

    if (createPromise) {
      instance.onAny(onAnyEvent);
      createPromise.then(function () {
        if (submission) {
          formio.submission = submission;
        }
      });
    }
  };

  (0, _react.useEffect)(function () {
    var src = props.src;

    if (src) {
      createWebformInstance(src).then(function () {
        formio.src = src;
      });
      initializeFormio();
    }
  }, [props.src]);

  (0, _react.useEffect)(function () {
    var form = props.form,
        url = props.url;

    if (form) {
      createWebformInstance(form).then(function () {
        formio.form = form;
        if (url) {
          formio.url = url;
        }
        return formio;
      });
      initializeFormio();
    }
  }, [props.form]);

  (0, _react.useEffect)(function () {
    var _props$options2 = props.options,
        options = _props$options2 === undefined ? {} : _props$options2;

    if (!options.events) {
      options.events = Form.getDefaultEmitter();
    }
  }, [props.options]);

  (0, _react.useEffect)(function () {
    var submission = props.submission;

    if (formio && submission) {
      formio.submission = submission;
    }
  }, [props.submission]);

  return _react2.default.createElement('div', { ref: function ref(el) {
      return element = el;
    } });
};

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

Form.getDefaultEmitter = function () {
  return new _eventemitter2.default({
    wildcard: false,
    maxListeners: 0
  });
};

exports.default = Form;