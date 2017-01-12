'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioResource = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reduxInjector = require('redux-injector');

var _redux = require('redux');

var _reducers = require('../Formio/reducers');

var _factories = require('../../factories');

var _views = require('./views');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormioResource = exports.FormioResource = function FormioResource(name, src) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  _classCallCheck(this, FormioResource);

  _initialiseProps.call(this);

  this.name = name;
  this.src = src;
  this.options = options;
  this.options.base = this.options.base || '';

  var reducer = this.getReducers(name, src);
  (0, _reduxInjector.injectReducer)(['formio', name], reducer);
  (0, _factories.addReducer)(name, reducer);
  (0, _factories.addRoute)(this.getRoutes());
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.basePath = function () {
    return _this.options.base + '/' + _this.name;
  };

  this.Container = _views.Container;
  this.Index = _views.Index;
  this.Create = _views.Create;
  this.View = _views.View;
  this.Edit = _views.Edit;
  this.Delete = _views.Delete;

  this.getRoutes = function () {
    return _react2.default.createElement(
      'div',
      { className: _this.name },
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath(), exactly: true, component: _this.Index(_this) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath() + 'Create', exactly: true, component: _this.Create(_this) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath() + '/:' + _this.name + 'Id', component: _this.Container(_this) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath() + '/:' + _this.name + 'Id', exactly: true, component: _this.View(_this) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath() + '/:' + _this.name + 'Id' + '/edit', exactly: true, component: _this.Edit(_this) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.basePath() + '/:' + _this.name + 'Id' + '/delete', exactly: true, component: _this.Delete(_this) })
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