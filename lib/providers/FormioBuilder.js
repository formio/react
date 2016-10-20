'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _factories = require('../factories');

var _builder = require('../views/builder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(name, src) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, _class);

    this.Index = _builder.Index;

    this.name = name;
    this.src = src;
    this.options = options;
    this.options.tag = this.options.tag || 'common';
    this.options.base = this.options.base || name ? '/' + name : '';

    //addReducer('currentUser', this.getReducers());
    (0, _factories.addRoute)(this.getRoutes());
  }

  /**
   * Global is used to enforce "forceAuth" and will redirect if not logged in.
   *
   * @returns {{contextTypes, new(*=, *=): {render}}}
   * @constructor
   */


  _createClass(_class, [{
    key: 'getReducers',
    value: function getReducers() {
      return userReducer();
    }
  }, {
    key: 'getRoutes',
    value: function getRoutes() {
      return _react2.default.createElement(
        'div',
        { className: 'formio-builder' },
        _react2.default.createElement(_reactRouter.Match, { pattern: this.options.base + '/forms', component: this.Index(this) })
      );
    }
  }]);

  return _class;
}();

exports.default = _class;