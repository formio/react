'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = require('formiojs/components');

var _components2 = _interopRequireDefault(_components);

var _Components = require('formiojs/components/Components');

var _Components2 = _interopRequireDefault(_Components);

var _FormBuilder = require('formiojs/FormBuilder');

var _FormBuilder2 = _interopRequireDefault(_FormBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Components2.default.setComponents(_components2.default);

var FormBuilder = function FormBuilder(props) {
  var builder = void 0;
  var builderReady = void 0;
  var element = void 0;

  var emit = function emit(funcName) {
    return function () {
      if (props.hasOwnProperty(funcName) && typeof props[funcName] === 'function') {
        props[funcName].apply(props, arguments);
      }
    };
  };

  var onChange = function onChange() {
    var onChange = props.onChange;

    if (onChange && typeof onChange === 'function') {
      onChange(builder.instance.form);
    }
  };

  var builderEvents = [{ name: 'saveComponent', action: emit('onSaveComponent') }, { name: 'updateComponent', action: emit('onUpdateComponent') }, { name: 'removeComponent', action: emit('onDeleteComponent') }, { name: 'cancelComponent', action: emit('onUpdateComponent') }, { name: 'editComponent', action: emit('onEditComponent') }, { name: 'addComponent', action: onChange }, { name: 'saveComponent', action: onChange }, { name: 'updateComponent', action: onChange }, { name: 'removeComponent', action: onChange }, { name: 'deleteComponent', action: onChange }, { name: 'pdfUploaded', action: onChange }];

  var initializeBuilder = function initializeBuilder(builderProps) {
    var options = builderProps.options,
        form = builderProps.form;
    var Builder = builderProps.Builder;

    options = Object.assign({}, options);
    form = Object.assign({}, form);

    builder = new Builder(element.firstChild, form, options);
    builderReady = builder.ready;

    builderReady.then(function () {
      onChange();
      builderEvents.forEach(function (_ref) {
        var name = _ref.name,
            action = _ref.action;
        return builder.instance.on(name, action);
      });
    });
  };

  (0, _react.useEffect)(function () {
    initializeBuilder(props);
    return function () {
      return builder ? builder.instance.destroy(true) : null;
    };
  }, [props.form.display, props.form.components, props.options]);

  return _react2.default.createElement(
    'div',
    { ref: function ref(el) {
        return element = el;
      } },
    _react2.default.createElement('div', null)
  );
};

FormBuilder.defaultProps = {
  options: {},
  Builder: _FormBuilder2.default
};

FormBuilder.propTypes = {
  form: _propTypes2.default.object,
  options: _propTypes2.default.object,
  onSaveComponent: _propTypes2.default.func,
  onUpdateComponent: _propTypes2.default.func,
  onDeleteComponent: _propTypes2.default.func,
  onCancelComponent: _propTypes2.default.func,
  onEditComponent: _propTypes2.default.func,
  Builder: _propTypes2.default.any
};

exports.default = FormBuilder;