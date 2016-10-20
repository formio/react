'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormActions = exports.FORMS_FAILURE = exports.FORMS_SUCCESS = exports.FORMS_REQUEST = exports.FORM_FAILURE = exports.FORM_SUCCESS = exports.FORM_REQUEST = undefined;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _alerts = require('./alerts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FORM_REQUEST = exports.FORM_REQUEST = 'FORM_REQUEST';
function requestForm(name, id) {
  return {
    type: FORM_REQUEST,
    name: name,
    id: id
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

var FORMS_REQUEST = exports.FORMS_REQUEST = 'FORMS_REQUEST';
function requestForms(name, tag) {
  return {
    type: FORMS_REQUEST,
    name: name,
    tag: tag
  };
}

var FORMS_SUCCESS = exports.FORMS_SUCCESS = 'FORMS_SUCCESS';
function receiveForms(name, forms) {
  return {
    type: FORMS_SUCCESS,
    forms: forms,
    name: name
  };
}

var FORMS_FAILURE = exports.FORMS_FAILURE = 'FORMS_FAILURE';
function failForms(name, err) {
  return {
    type: FORMS_FAILURE,
    error: err,
    name: name
  };
}

var FormActions = exports.FormActions = {
  fetch: function fetch(name) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return function (dispatch, getState) {
      // Check to see if the form is already loaded.
      var _getState = getState();

      var formio = _getState.formio;

      if (formio[name].form.form.components && formio[name].form.id === id) {
        return;
      }

      dispatch(requestForm(name, id));

      var path = formio[name].form.src + (id ? '/form/' + id : '');
      var formioForm = (0, _formiojs2.default)(path);

      formioForm.loadForm().then(function (result) {
        dispatch(receiveForm(name, result));
      }).catch(function (result) {
        dispatch(_alerts.AlertActions.add({
          type: 'danger',
          message: result
        }));
        dispatch(failForm(name, result));
      });
    };
  },
  index: function index(name, tag) {
    var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    return function (dispatch, getState) {
      dispatch(requestForms(name, tag, page));
      var forms = getState().formio[name].forms;

      var params = {};
      if (tag) {
        params.tags = tag;
      }
      if (parseInt(forms.limit) !== 10) {
        params.limit = forms.limit;
      }
      if (page !== 1) {
        params.skip = (parseInt(page) - 1) * parseInt(forms.limit);
        params.limit = parseInt(forms.limit);
      }
      var formio = (0, _formiojs2.default)(forms.src);

      formio.loadForms({ params: params }).then(function (result) {
        dispatch(receiveForms(name, result));
      }).catch(function (result) {
        dispatch(failForms(name.result));
      });
    };
  }
};