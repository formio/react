'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _actionsSubmissions = require('../actions/submissions');

exports['default'] = function (name, src) {
  return function (state, action) {
    if (state === undefined) state = {
      src: src + '/submission',
      name: name,
      isFetching: false,
      lastUpdated: 0,
      submissions: [],
      limit: 10,
      pagination: {
        page: 1
      },
      error: ''
    };

    // Only proceed for this form.
    if (action.name !== state.name) {
      return state;
    }
    switch (action.type) {
      case _actionsSubmissions.SUBMISSIONS_REQUEST:
        var limit = action.limit || state.limit;
        return _extends({}, state, {
          limit: limit,
          isFetching: true,
          submissions: [],
          pagination: {
            page: action.page || state.pagination.page
          },
          error: ''
        });
      case _actionsSubmissions.SUBMISSIONS_SUCCESS:
        return _extends({}, state, {
          submissions: action.submissions,
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil(action.submissions.serverCount / state.limit),
            total: action.submissions.serverCount
          },
          isFetching: false,
          error: ''
        });
      case _actionsSubmissions.SUBMISSIONS_FAILURE:
        return _extends({}, state, {
          isFetching: false,
          error: action.error
        });
      default:
        return state;
    }
  };
};

module.exports = exports['default'];