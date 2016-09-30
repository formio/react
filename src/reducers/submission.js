'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actionsSubmission = require('../actions/submission');

exports['default'] = function (name, src) {
  return function (state, action) {
    if (state === undefined) state = {
      src: src + '/submission',
      name: name,
      isFetching: false,
      lastUpdated: 0,
      submission: {},
      error: ''
    };

    // Only proceed for this form.
    if (action.name !== state.name) {
      return state;
    }
    switch (action.type) {
      case _actionsSubmission.SUBMISSION_REQUEST:
        return _extends({}, state, {
          src: action.src,
          name: action.name,
          isFetching: true
        });
      case _actionsSubmission.SUBMISSION_SUCCESS:
        return _extends({}, state, {
          submission: action.submission,
          isFetching: false,
          error: ''
        });
      case _actionsSubmission.SUBMISSION_FAILURE:
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

module.exports = exports['default'];