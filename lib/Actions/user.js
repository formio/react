'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserActions = exports.USER_FORM_ACCESS = exports.USER_SUBMISSION_ACCESS = exports.USER_LOGOUT = exports.USER_FAILURE = exports.USER_SUCCESS = exports.USER_REQUEST = undefined;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var USER_REQUEST = exports.USER_REQUEST = 'USER_REQUEST';
function requestUser() {
  return {
    type: USER_REQUEST
  };
}

var USER_SUCCESS = exports.USER_SUCCESS = 'USER_SUCCESS';
function receiveUser(user) {
  return {
    type: USER_SUCCESS,
    user: user
  };
}

var USER_FAILURE = exports.USER_FAILURE = 'USER_FAILURE';
function failUser(err) {
  return {
    type: USER_FAILURE,
    error: err
  };
}

var USER_LOGOUT = exports.USER_LOGOUT = 'USER_LOGOUT';
function logoutUser() {
  return {
    type: USER_LOGOUT
  };
}

var USER_SUBMISSION_ACCESS = exports.USER_SUBMISSION_ACCESS = 'USER_SUBMISSION_ACCESS';
function submissionAccessUser(submissionAccess, roles) {
  return {
    type: USER_SUBMISSION_ACCESS,
    submissionAccess: submissionAccess,
    roles: roles
  };
}

var USER_FORM_ACCESS = exports.USER_FORM_ACCESS = 'USER_FORM_ACCESS';
function formAccessUser(formAccess) {
  return {
    type: USER_FORM_ACCESS,
    formAccess: formAccess
  };
}

var getAccess = function getAccess(dispatch, getState) {
  var appUrl = getState().formio.auth.appUrl;

  _formiojs2.default.makeStaticRequest(appUrl + '/access').then(function (result) {
    var submissionAccess = {};
    Object.keys(result.forms).forEach(function (key) {
      var form = result.forms[key];
      submissionAccess[form.name] = {};
      form.submissionAccess.forEach(function (access) {
        submissionAccess[form.name][access.type] = access.roles;
      });
    });
    dispatch(submissionAccessUser(submissionAccess, result.roles));
  }).catch(function (err) {
    console.log(err);
  });
  _formiojs2.default.makeStaticRequest(appUrl).then(function (project) {
    var formAccess = {};
    project.access.forEach(function (access) {
      formAccess[access.type] = access.roles;
    });
    dispatch(formAccessUser(formAccess));
  }).catch(function (err) {
    console.log(err);
  });
};

var UserActions = exports.UserActions = {
  fetch: function fetch() {
    return function (dispatch, getState) {
      dispatch(requestUser());

      _formiojs2.default.currentUser().then(function (result) {
        dispatch(receiveUser(result));
        getAccess(dispatch, getState);
      }).catch(function (result) {
        dispatch(failUser(result));
      });
    };
  },
  logout: function logout() {
    return function (dispatch, getState) {
      _formiojs2.default.logout().then(function () {
        dispatch(logoutUser());
        getAccess(dispatch, getState);
      });
    };
  }
};