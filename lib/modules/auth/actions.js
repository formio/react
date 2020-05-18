'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.setUser = exports.initAuth = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Formio = require('formiojs/Formio');

var _Formio2 = _interopRequireDefault(_Formio);

var _constants = require('./constants');

var type = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var requestUser = function requestUser() {
  return {
    type: type.USER_REQUEST
  };
};

var receiveUser = function receiveUser(user) {
  return {
    type: type.USER_REQUEST_SUCCESS,
    user: user
  };
};

var failUser = function failUser(error) {
  return {
    type: type.USER_REQUEST_FAILURE,
    error: error
  };
};

var logoutUser = function logoutUser() {
  return {
    type: type.USER_LOGOUT
  };
};

var submissionAccessUser = function submissionAccessUser(submissionAccess) {
  return {
    type: type.USER_SUBMISSION_ACCESS,
    submissionAccess: submissionAccess
  };
};

var formAccessUser = function formAccessUser(formAccess) {
  return {
    type: type.USER_FORM_ACCESS,
    formAccess: formAccess
  };
};

var projectAccessUser = function projectAccessUser(projectAccess) {
  return {
    type: type.USER_PROJECT_ACCESS,
    projectAccess: projectAccess
  };
};

var rolesUser = function rolesUser(roles) {
  return {
    type: type.USER_ROLES,
    roles: roles
  };
};

function transformSubmissionAccess(forms) {
  return Object.values(forms).reduce(function (result, form) {
    return _extends({}, result, _defineProperty({}, form.name, form.submissionAccess.reduce(function (formSubmissionAccess, access) {
      return _extends({}, formSubmissionAccess, _defineProperty({}, access.type, access.roles));
    }, {})));
  }, {});
}

function transformFormAccess(forms) {
  return Object.values(forms).reduce(function (result, form) {
    return _extends({}, result, _defineProperty({}, form.name, form.access.reduce(function (formAccess, access) {
      return _extends({}, formAccess, _defineProperty({}, access.type, access.roles));
    }, {})));
  }, {});
}

function transformProjectAccess(projectAccess) {
  return projectAccess.reduce(function (result, access) {
    return _extends({}, result, _defineProperty({}, access.type, access.roles));
  }, {});
}

var initAuth = exports.initAuth = function initAuth() {
  return function (dispatch) {
    var projectUrl = _Formio2.default.getProjectUrl();

    dispatch(requestUser());

    Promise.all([_Formio2.default.currentUser(), _Formio2.default.makeStaticRequest(projectUrl + '/access').then(function (result) {
      var submissionAccess = transformSubmissionAccess(result.forms);
      var formAccess = transformFormAccess(result.forms);

      dispatch(submissionAccessUser(submissionAccess));
      dispatch(formAccessUser(formAccess));
      dispatch(rolesUser(result.roles));
    }).catch(function () {}), _Formio2.default.makeStaticRequest(projectUrl).then(function (project) {
      var projectAccess = transformProjectAccess(project.access);
      dispatch(projectAccessUser(projectAccess));
    }).catch(function () {})]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          user = _ref2[0];

      if (user) {
        dispatch(receiveUser(user));
      } else {
        dispatch(logoutUser());
      }
    }).catch(function (result) {
      dispatch(failUser(result));
    });
  };
};

var setUser = exports.setUser = function setUser(user) {
  return function (dispatch) {
    _Formio2.default.setUser(user);
    dispatch(receiveUser(user));
  };
};

var logout = exports.logout = function logout() {
  return function (dispatch) {
    _Formio2.default.logout();
    dispatch(logoutUser());
  };
};