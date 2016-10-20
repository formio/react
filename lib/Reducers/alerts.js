'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = require('../actions');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function () {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      alerts: []
    };
    var action = arguments[1];

    // Only proceed for this user.
    switch (action.type) {
      case _actions.ALERT_ADD:
        return _extends({}, state, {
          alerts: [].concat(_toConsumableArray(state.alerts), [action.alert])
        });
      case _actions.ALERT_RESET:
        return _extends({}, state, {
          alerts: []
        });
      default:
        return state;
    }
  };
};