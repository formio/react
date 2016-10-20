'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _redux = require('redux');

var _reducers = require('../reducers');

var _factories = require('../factories');

var _builder = require('../views/builder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(name, appUrl) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, _class);

    this.Index = _builder.Index;
    this.Create = _builder.Create;
    this.Form = _builder.Form;
    this.View = _builder.View;
    this.Edit = _builder.Edit;
    this.Delete = _builder.Delete;
    this.SubmissionIndex = _builder.SubmissionIndex;
    this.ActionsIndex = _builder.ActionsIndex;
    this.Access = _builder.Access;

    this.name = name;
    this.key = name || 'forms';
    this.appUrl = appUrl;
    this.options = options;
    this.options.tag = this.options.tag || 'common';
    this.options.base = this.options.base || name ? '/' + name : '';

    (0, _factories.addReducer)(this.key, this.getReducers(this.key, this.appUrl));
    (0, _factories.addRoute)(this.getRoutes());
  }

  _createClass(_class, [{
    key: 'getReducers',
    value: function getReducers(name, src) {
      return (0, _redux.combineReducers)({
        form: (0, _reducers.formReducer)(name, src),
        forms: (0, _reducers.formsReducer)(name, src),
        submission: (0, _reducers.submissionReducer)(name, src),
        submissions: (0, _reducers.submissionsReducer)(name, src)
      });
    }
  }, {
    key: 'getRoutes',
    value: function getRoutes() {
      return _react2.default.createElement(
        'div',
        { className: 'formio-builder' },
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/forms', exactly: true, component: this.Index(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/forms/create', exactly: true, component: this.Create(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/form/:' + this.key + 'Id', component: this.Form(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/form/:' + this.key + 'Id', exactly: true, component: this.View(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/form/:' + this.key + 'Id/edit', exactly: true, component: this.Edit(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/form/:' + this.key + 'Id/delete', exactly: true, component: this.Delete(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/form/:' + this.key + 'Id/submission', exactly: true, component: this.SubmissionIndex(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/form/:' + this.key + 'Id/actions', exactly: true, component: this.ActionsIndex(this) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/form/:' + this.key + 'Id/access', exactly: true, component: this.Access(this) })
      );
    }
  }]);

  return _class;
}();

exports.default = _class;