'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Wrapper = require('./containers/Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

var _Resource = require('./containers/Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _Index = require('./containers/Index');

var _Index2 = _interopRequireDefault(_Index);

var _Create = require('./containers/Create');

var _Create2 = _interopRequireDefault(_Create);

var _View = require('./containers/View');

var _View2 = _interopRequireDefault(_View);

var _Edit = require('./containers/Edit');

var _Edit2 = _interopRequireDefault(_Edit);

var _Delete = require('./containers/Delete');

var _Delete2 = _interopRequireDefault(_Delete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (config) {
  var childRoutes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return [{
    path: config.name,
    component: config.Wrapper || (0, _Wrapper2.default)(config),
    indexRoute: {
      component: config.Index || (0, _Index2.default)(config)
    },
    childRoutes: [{
      path: 'new',
      component: config.Create || (0, _Create2.default)(config)
    }, {
      path: ':' + config.name + 'Id',
      component: (config.Resource || _Resource2.default)(config),
      indexRoute: {
        component: config.View || (0, _View2.default)(config)
      },
      childRoutes: [{
        path: 'edit',
        component: config.Edit || (0, _Edit2.default)(config)
      }, {
        path: 'delete',
        component: config.Delete || (0, _Delete2.default)(config)
      }].concat(_toConsumableArray(childRoutes))
    }]
  }];
};