'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Auth = require('./containers/Auth');

var _Auth2 = _interopRequireDefault(_Auth);

var _Login = require('./containers/Login');

var _Login2 = _interopRequireDefault(_Login);

var _Register = require('./containers/Register');

var _Register2 = _interopRequireDefault(_Register);

var _ProtectAnon = require('./containers/ProtectAnon');

var _ProtectAnon2 = _interopRequireDefault(_ProtectAnon);

var _ProtectAuth = require('./containers/ProtectAuth');

var _ProtectAuth2 = _interopRequireDefault(_ProtectAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (config) {
  var allRoutes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var anonRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var authRoutes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  return [].concat(_toConsumableArray(allRoutes), [{
    component: _ProtectAnon2.default,
    childRoutes: [].concat(_toConsumableArray(anonRoutes), [{
      path: config.path,
      component: config.Auth || _Auth2.default,
      indexRoute: {
        component: _Login2.default
      },
      childRoutes: [{
        path: 'login',
        component: config.Login || _Login2.default
      }, {
        path: 'register',
        component: config.Register || _Register2.default
      }]
    }])
  }, {
    component: _ProtectAuth2.default,
    childRoutes: authRoutes
  }]);
};