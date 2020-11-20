'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FormBuilder = require('./FormBuilder');

var _FormBuilder2 = _interopRequireDefault(_FormBuilder);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _camelCase2 = require('lodash/camelCase');

var _camelCase3 = _interopRequireDefault(_camelCase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducer = function reducer(form, _ref) {
  var type = _ref.type,
      value = _ref.value;

  var formCopy = (0, _cloneDeep3.default)(form);
  switch (type) {
    case 'formChange':
      return _extends({}, form, value);
    case 'replaceForm':
      return (0, _cloneDeep3.default)(value);
    case 'title':
      if (type === 'title' && !form._id) {
        formCopy.name = (0, _camelCase3.default)(value);
        formCopy.path = (0, _camelCase3.default)(value).toLowerCase();
      }
      break;
    default:
      return form;
  }
  (0, _set3.default)(formCopy, type, value);
  return formCopy;
};

var FormEdit = function FormEdit(props) {
  var _useReducer = (0, _react.useReducer)(reducer, (0, _cloneDeep3.default)(props.form)),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      form = _useReducer2[0],
      dispatchFormAction = _useReducer2[1];

  (0, _react.useEffect)(function () {
    var newForm = props.form;

    if (newForm && (form._id !== newForm._id || form.modified !== newForm.modified)) {
      dispatchFormAction({ type: 'replaceForm', value: newForm });
    }
  }, [props.form]);

  var saveForm = function saveForm() {
    var saveForm = props.saveForm;

    if (saveForm && typeof saveForm === 'function') {
      saveForm(form);
    }
  };

  var handleChange = function handleChange(path, event) {
    var target = event.target;

    var value = target.type === 'checkbox' ? target.checked : target.value;
    dispatchFormAction({ type: path, value: value });
  };

  var formChange = function formChange(newForm) {
    return dispatchFormAction({ type: 'formChange', value: newForm });
  };

  var saveText = props.saveText,
      options = props.options,
      builder = props.builder;


  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { className: 'row' },
      _react2.default.createElement(
        'div',
        { className: 'col-lg-2 col-md-4 col-sm-4' },
        _react2.default.createElement(
          'div',
          { id: 'form-group-title', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'title', className: 'control-label field-required' },
            'Title'
          ),
          _react2.default.createElement('input', {
            type: 'text',
            className: 'form-control', id: 'title',
            placeholder: 'Enter the form title',
            value: form.title || '',
            onChange: function onChange(event) {
              return handleChange('title', event);
            }
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'col-lg-2 col-md-4 col-sm-4' },
        _react2.default.createElement(
          'div',
          { id: 'form-group-name', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'name', className: 'control-label field-required' },
            'Name'
          ),
          _react2.default.createElement('input', {
            type: 'text',
            className: 'form-control',
            id: 'name',
            placeholder: 'Enter the form machine name',
            value: form.name || '',
            onChange: function onChange(event) {
              return handleChange('name', event);
            }
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'col-lg-2 col-md-3 col-sm-3' },
        _react2.default.createElement(
          'div',
          { id: 'form-group-display', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'name', className: 'control-label' },
            'Display as'
          ),
          _react2.default.createElement(
            'div',
            { className: 'input-group' },
            _react2.default.createElement(
              'select',
              {
                className: 'form-control',
                name: 'form-display',
                id: 'form-display',
                value: form.display || '',
                onChange: function onChange(event) {
                  return handleChange('display', event);
                }
              },
              _react2.default.createElement(
                'option',
                { label: 'Form', value: 'form' },
                'Form'
              ),
              _react2.default.createElement(
                'option',
                { label: 'Wizard', value: 'wizard' },
                'Wizard'
              ),
              _react2.default.createElement(
                'option',
                { label: 'PDF', value: 'pdf' },
                'PDF'
              )
            )
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'col-lg-2 col-md-3 col-sm-3' },
        _react2.default.createElement(
          'div',
          { id: 'form-group-type', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'form-type', className: 'control-label' },
            'Type'
          ),
          _react2.default.createElement(
            'div',
            { className: 'input-group' },
            _react2.default.createElement(
              'select',
              {
                className: 'form-control',
                name: 'form-type',
                id: 'form-type',
                value: form.type,
                onChange: function onChange(event) {
                  return handleChange('type', event);
                }
              },
              _react2.default.createElement(
                'option',
                { label: 'Form', value: 'form' },
                'Form'
              ),
              _react2.default.createElement(
                'option',
                { label: 'Resource', value: 'resource' },
                'Resource'
              )
            )
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'col-lg-2 col-md-4 col-sm-4' },
        _react2.default.createElement(
          'div',
          { id: 'form-group-path', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'path', className: 'control-label field-required' },
            'Path'
          ),
          _react2.default.createElement(
            'div',
            { className: 'input-group' },
            _react2.default.createElement('input', {
              type: 'text',
              className: 'form-control',
              id: 'path',
              placeholder: 'example',
              style: { 'textTransform': 'lowercase', width: '120px' },
              value: form.path || '',
              onChange: function onChange(event) {
                return handleChange('path', event);
              }
            })
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { id: 'save-buttons', className: 'col-lg-2 col-md-5 col-sm-5 save-buttons pull-right' },
        _react2.default.createElement(
          'div',
          { className: 'form-group pull-right' },
          _react2.default.createElement(
            'span',
            { className: 'btn btn-primary', onClick: function onClick() {
                return saveForm();
              } },
            saveText
          )
        )
      )
    ),
    _react2.default.createElement(_FormBuilder2.default, {
      key: form._id,
      form: form,
      options: options,
      builder: builder,
      onChange: formChange
    })
  );
};

FormEdit.propTypes = {
  form: _propTypes2.default.object.isRequired,
  options: _propTypes2.default.object,
  builder: _propTypes2.default.any,
  onSave: _propTypes2.default.func
};

FormEdit.defaultProps = {
  form: {
    title: '',
    name: '',
    path: '',
    display: 'form',
    type: 'form',
    components: []
  }
};

exports.default = FormEdit;