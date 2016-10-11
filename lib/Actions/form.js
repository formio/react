'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormActions = exports.FORM_FAILURE = exports.FORM_SUCCESS = exports.FORM_REQUEST = undefined;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FORM_REQUEST = exports.FORM_REQUEST = 'FORM_REQUEST';
function requestForm(name) {
  return {
    type: FORM_REQUEST,
    name: name
  };
}

var FORM_SUCCESS = exports.FORM_SUCCESS = 'FORM_SUCCESS';
function receiveForm(name, form) {
  return {
    type: FORM_SUCCESS,
    form: form,
    name: name
  };
}

var FORM_FAILURE = exports.FORM_FAILURE = 'FORM_FAILURE';
function failForm(name, err) {
  return {
    type: FORM_FAILURE,
    error: err,
    name: name
  };
}

var FormActions = exports.FormActions = {
  fetch: function fetch(name) {
    return function (dispatch, getState) {
      // Check to see if the form is already loaded.
      if (getState().formio[name].form.form.components) {
        return;
      }

      dispatch(requestForm(name));

      var formio = (0, _formiojs2.default)(getState().formio[name].form.src);

      formio.loadForm().then(function (result) {
        dispatch(receiveForm(name, result));
      }).catch(function (result) {
        dispatch(failForm(name, result));
      });
    };
  },
  index: function index() {}
};