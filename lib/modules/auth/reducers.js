'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _constants = require('./constants');

var type = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  init: false,
  isActive: false,
  user: null,
  authenticated: false,
  submissionAccess: {},
  formAccess: {},
  projectAccess: {},
  roles: {},
  is: {},
  error: ''
};

function mapProjectRolesToUserRoles(projectRoles, userRoles) {
  return Object.entries(projectRoles).reduce(function (result, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        role = _ref2[1];

    return _extends({}, result, _defineProperty({}, name, userRoles.includes(role._id)));
  }, {});
}

function getUserRoles(projectRoles) {
  return Object.keys(projectRoles).reduce(function (result, name) {
    return _extends({}, result, _defineProperty({}, name, name === 'anonymous'));
  }, {});
}

var auth = exports.auth = function auth(config) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
      case type.USER_REQUEST:
        return _extends({}, state, {
          init: true,
          submissionAccess: false,
          isActive: true
        });
      case type.USER_REQUEST_SUCCESS:
        return _extends({}, state, {
          isActive: false,
          user: action.user,
          authenticated: true,
          is: mapProjectRolesToUserRoles(state.roles, action.user.roles),
          error: ''
        });
      case type.USER_REQUEST_FAILURE:
        return _extends({}, state, {
          isActive: false,
          is: getUserRoles(state.roles),
          error: action.error
        });
      case type.USER_LOGOUT:
        return _extends({}, state, {
          user: null,
          isActive: false,
          authenticated: false,
          is: getUserRoles(state.roles),
          error: ''
        });
      case type.USER_SUBMISSION_ACCESS:
        return _extends({}, state, {
          submissionAccess: action.submissionAccess
        });
      case type.USER_FORM_ACCESS:
        return _extends({}, state, {
          formAccess: action.formAccess
        });
      case type.USER_PROJECT_ACCESS:
        return _extends({}, state, {
          projectAccess: action.projectAccess
        });
      case type.USER_ROLES:
        return _extends({}, state, {
          roles: action.roles
        });
      default:
        return state;
    }
  };
};