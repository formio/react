'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserActions = exports.USER_FAILURE = exports.USER_SUCCESS = exports.USER_REQUEST = undefined;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var USER_REQUEST = exports.USER_REQUEST = 'USER_REQUEST';
function requestUser() {
  return {
    type: USER_REQUEST
  };
}

var USER_SUCCESS = exports.USER_SUCCESS = 'USER_SUCCESS';
function receiveUser(user) {
  return {
    type: USER_SUCCESS,
    user: user
  };
}

var USER_FAILURE = exports.USER_FAILURE = 'USER_FAILURE';
function failUser(err) {
  return {
    type: USER_FAILURE,
    error: err
  };
}

var UserActions = exports.UserActions = {
  fetch: function fetch() {
    return function (dispatch) {
      dispatch(requestUser());

      _formiojs2.default.currentUser().then(function (result) {
        dispatch(receiveUser(result));
      }).catch(function (result) {
        dispatch(failUser(result));
      });
    };
  },
  logout: function logout() {}
};