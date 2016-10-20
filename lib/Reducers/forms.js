'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = require('../actions');

exports.default = function (name, src) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      src: src + '/form',
      name: name,
      tag: '',
      isFetching: false,
      lastUpdated: 0,
      forms: [],
      limit: 100,
      pagination: {
        page: 1
      },
      error: ''
    };
    var action = arguments[1];

    // Only proceed for this forms.
    if (action.name !== state.name) {
      return state;
    }
    switch (action.type) {
      case _actions.FORMS_REQUEST:
        return _extends({}, state, {
          limit: action.limit || state.limit,
          tag: action.tag,
          isFetching: true,
          pagination: {
            page: action.page || state.pagination.page
          },
          error: ''
        });
      case _actions.FORMS_SUCCESS:
        return _extends({}, state, {
          forms: action.forms,
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil(action.forms.serverCount / state.limit),
            total: action.forms.serverCount
          },
          isFetching: false,
          error: ''
        });
      case _actions.FORMS_FAILURE:
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