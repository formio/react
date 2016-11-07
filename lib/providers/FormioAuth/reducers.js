'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authReducer = undefined;

var _immutable = require('immutable');

var _actions = require('./actions');

var authReducer = exports.authReducer = function authReducer(appUrl) {
  var initialState = (0, _immutable.fromJS)({
    init: false,
    isFetching: false,
    user: null,
    formAccess: false,
    submissionAccess: false,
    roles: {},
    appUrl: appUrl,
    error: ''
  });

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    // Only proceed for this user.
    switch (action.type) {
      case _actions.USER_REQUEST:
        return state.set('init', true).set('submissionAccess', false).set('isFetching', true);
      case _actions.USER_SUCCESS:
        return state.set('user', action.user).set('isFetching', false).set('error', '');
      case _actions.USER_SUBMISSION_ACCESS:
        return state.set('submissionAccess', action.submissionAccess).set('roles', action.roles);
      case _actions.USER_FORM_ACCESS:
        return state.set('formAccess', action.formAccess);
      case _actions.USER_FAILURE:
        return state.set('isFetching', false).set('error', action.error);
      case _actions.USER_LOGOUT:
        return state.set('user', null).set('isFetching', false).set('error', '');
      default:
        return state;
    }
  };
};