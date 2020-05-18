'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Wrapper = require('./containers/Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

var _Index = require('./containers/Index');

var _Index2 = _interopRequireDefault(_Index);

var _Create = require('./containers/Create');

var _Create2 = _interopRequireDefault(_Create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import view from './containers/View';
// import edit from './containers/Edit';
// import deleteView from './containers/Delete';

// import resource from './containers/Resource';
exports.default = function (config) {
  var childRoutes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return [{
    path: config.name,
    component: config.Wrapper || (0, _Wrapper2.default)(config),
    indexRoute: {
      component: config.Index || (0, _Index2.default)(config)
    },
    childRoutes: [{
      path: 'create',
      component: config.Create || (0, _Create2.default)(config)
    }]
  }];
};