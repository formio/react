'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteForm = exports.saveForm = exports.getForm = exports.resetForm = exports.clearFormError = undefined;

var _Formio = require('formiojs/Formio');

var _Formio2 = _interopRequireDefault(_Formio);

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

var _selectors = require('./selectors');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clearFormError = exports.clearFormError = function clearFormError(name) {
  return {
    type: types.FORM_CLEAR_ERROR,
    name: name
  };
};

var requestForm = function requestForm(name, id, url) {
  return {
    type: types.FORM_REQUEST,
    name: name,
    id: id,
    url: url
  };
};

var receiveForm = function receiveForm(name, form, url) {
  return {
    type: types.FORM_SUCCESS,
    form: form,
    name: name,
    url: url
  };
};

var failForm = function failForm(name, err) {
  return {
    type: types.FORM_FAILURE,
    error: err,
    name: name
  };
};

var resetForm = exports.resetForm = function resetForm(name) {
  return {
    type: types.FORM_RESET,
    name: name
  };
};

var sendForm = function sendForm(name, form) {
  return {
    type: types.FORM_SAVE,
    form: form,
    name: name
  };
};

var getForm = exports.getForm = function getForm(name) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  return function (dispatch, getState) {
    // Check to see if the form is already loaded.
    var form = (0, _selectors.selectForm)(name, getState());
    if (form.components && Array.isArray(form.components) && form.components.length && form._id === id) {
      return;
    }

    var path = _Formio2.default.getProjectUrl() + '/' + (id ? 'form/' + id : name);
    var formio = new _Formio2.default(path);

    dispatch(requestForm(name, id, path));

    return formio.loadForm().then(function (result) {
      dispatch(receiveForm(name, result));
      done(null, result);
    }).catch(function (result) {
      dispatch(failForm(name, result));
      done(result);
    });
  };
};

var saveForm = exports.saveForm = function saveForm(name, form) {
  var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  return function (dispatch) {
    dispatch(sendForm(name, form));

    var id = form._id;
    var path = _Formio2.default.getProjectUrl() + '/form' + (id ? '/' + id : '');
    var formio = new _Formio2.default(path);

    formio.saveForm(form).then(function (result) {
      var url = _Formio2.default.getProjectUrl() + '/form/' + result._id;
      dispatch(receiveForm(name, result, url));
      done(null, result);
    }).catch(function (result) {
      dispatch(failForm(name, result));
      done(result);
    });
  };
};

var deleteForm = exports.deleteForm = function deleteForm(name, id) {
  var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  return function (dispatch) {
    var path = _Formio2.default.getProjectUrl() + '/form/' + id;
    var formio = new _Formio2.default(path);

    return formio.deleteForm().then(function () {
      dispatch(resetForm(name));
      done();
    }).catch(function (result) {
      dispatch(failForm(name, result));
      done(result);
    });
  };
};