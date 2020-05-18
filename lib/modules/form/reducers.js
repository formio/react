'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.form = form;

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function form(config) {
  var initialState = {
    error: '',
    form: {},
    options: config.options,
    projectUrl: config.projectUrl,
    id: '',
    isActive: false,
    url: ''
  };

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }

    switch (action.type) {
      case types.FORM_CLEAR_ERROR:
        return _extends({}, state, {
          error: ''
        });
      case types.FORM_RESET:
        return initialState;
      case types.FORM_REQUEST:
        return _extends({}, initialState, {
          isActive: true
        });
      case types.FORM_SAVE:
        return _extends({}, state, {
          error: '',
          isActive: true
        });
      case types.FORM_SUCCESS:
        return _extends({}, state, {
          form: action.form,
          id: action.form._id,
          isActive: false,
          url: action.url
        });
      case types.FORM_FAILURE:
        return _extends({}, state, {
          error: action.error,
          isActive: false
        });
      default:
        return state;
    }
  };
}