'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _selectors = require('./selectors');

var _selectors2 = _interopRequireDefault(_selectors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(config) {
    var _this = this;

    _classCallCheck(this, _class);

    this.constants = constants;

    var defaultConfig = {
      parents: [],
      rootSelector: function rootSelector(state) {
        return state;
      }
    };

    this.config = Object.assign(defaultConfig, config);

    this.actions = (0, _actions2.default)(this);
    this.selectors = (0, _selectors2.default)(this.config);
    this.reducers = (0, _reducers2.default)(this.config);
    this.getRoutes = function (childRoutes) {
      return (0, _routes2.default)(_this.config, childRoutes);
    };
  }

  _createClass(_class, [{
    key: 'getBasePath',
    value: function getBasePath(params) {
      var path = '/';

      this.config.parents.forEach(function (parent) {
        path += parent + '/' + params[parent + 'Id'] + '/';
      });

      return path;
    }
  }]);

  return _class;
}();

exports.default = _class;