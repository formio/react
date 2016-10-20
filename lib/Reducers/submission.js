'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = require('../actions');

exports.default = function (name, src) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      src: src,
      id: '',
      name: name,
      isFetching: false,
      lastUpdated: 0,
      submission: {},
      error: ''
    };
    var action = arguments[1];

    // Only proceed for this form.
    if (action.name !== state.name) {
      return state;
    }
    switch (action.type) {
      case _actions.SUBMISSION_REQUEST:
        return _extends({}, state, {
          id: action.id,
          submission: {},
          isFetching: true
        });
      case _actions.SUBMISSION_SUCCESS:
        return _extends({}, state, {
          id: action.submission._id,
          submission: action.submission,
          isFetching: false,
          error: ''
        });
      case _actions.SUBMISSION_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          isInvalid: true,
          error: action.error
        });
      default:
        return state;
    }
  };
};