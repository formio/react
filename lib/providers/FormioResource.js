'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _redux = require('redux');

var _reducers = require('../reducers');

var _factories = require('../factories');

var _resource = require('../views/resource');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function _class(name, src) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  _classCallCheck(this, _class);

  _initialiseProps.call(this);

  this.name = name;
  this.src = src;
  this.options = options;
  this.options.base = this.options.base || '';

  (0, _factories.addReducer)(name, this.getReducers(name, src));
  (0, _factories.addRoute)(this.getRoutes());
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.basePath = function () {
    return _this.options.base + '/' + _this.name;
  };

  this.Container = _resource.Container;
  this.Index = _resource.Index;
  this.Create = _resource.Create;
  this.View = _resource.View;
  this.Edit = _resource.Edit;
  this.Delete = _resource.Delete;

  this.getRoutes = function () {
    return _react2.default.createElement(
      'div',
      { className: _this.name },
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath(), exactly: true, component: _this.Index(_this) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath() + 'Create', exactly: true, component: _this.Create(_this) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath() + '/:' + _this.name + 'Id', component: _this.Container(_this) })
    );
  };

  this.getReducers = function (name, src) {
    return (0, _redux.combineReducers)({
      form: (0, _reducers.formReducer)(name, src),
      submission: (0, _reducers.submissionReducer)(name, src),
      submissions: (0, _reducers.submissionsReducer)(name, src)
    });
  };
};

exports.default = _class;