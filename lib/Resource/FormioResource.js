'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioResource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _actions = require('../actions');

var _reducers = require('../reducers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormioResource = function () {
  function FormioResource(name, src, store, history) {
    _classCallCheck(this, FormioResource);

    this.name = name;
    this.src = src;
    this.store = store;
    this.history = history;

    (0, _reducers.injectReducers)(name, src);
  }

  _createClass(FormioResource, [{
    key: 'connectView',
    value: function connectView(view, state, next) {
      next(null, (0, _reactRedux.connect)(options[view].mapStateToProps, options[view].mapDispatchToProps)(options[view].container));
    }
  }, {
    key: 'getRoutes',
    value: function getRoutes() {}
  }]);

  return FormioResource;
}();

exports.FormioResource = FormioResource;