'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.submission = submission;

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function submission(config) {
  var initialState = {
    formId: '',
    id: '',
    isActive: false,
    lastUpdated: 0,
    submission: {},
    url: '',
    error: ''
  };

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.SUBMISSION_CLEAR_ERROR:
        return _extends({}, state, {
          error: ''
        });
      case types.SUBMISSION_REQUEST:
        return _extends({}, state, {
          formId: action.formId,
          id: action.id,
          url: action.url,
          submission: {},
          isActive: true
        });
      case types.SUBMISSION_SAVE:
        return _extends({}, state, {
          formId: action.formId,
          id: action.id,
          url: action.url || state.url,
          submission: {},
          isActive: true
        });
      case types.SUBMISSION_SUCCESS:
        return _extends({}, state, {
          id: action.submission._id,
          submission: action.submission,
          isActive: false,
          error: ''
        });
      case types.SUBMISSION_FAILURE:
        return _extends({}, state, {
          isActive: false,
          isInvalid: true,
          error: action.error
        });
      case types.SUBMISSION_RESET:
        return initialState;
      default:
        return state;
    }
  };
}