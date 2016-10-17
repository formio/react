'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = require('../actions');

exports.default = function () {
  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {
      init: false,
      isFetching: false,
      user: null,
      error: ''
    } : arguments[0];
    var action = arguments[1];

    // Only proceed for this user.
    switch (action.type) {
      case _actions.USER_REQUEST:
        return _extends({}, state, {
          init: true,
          isFetching: true
        });
      case _actions.USER_SUCCESS:
        return _extends({}, state, {
          user: action.user,
          isFetching: false,
          error: ''
        });
      case _actions.USER_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          error: action.error
        });
      case _actions.USER_LOGOUT:
        return _extends({}, state, {
          user: null,
          isFetching: false,
          error: ''
        });
      default:
        return state;
    }
  };
};