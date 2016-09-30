'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.injectReducers = injectReducers;
exports.formioReducers = formioReducers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _redux = require('redux');

var _form = require('./form');

var _form2 = _interopRequireDefault(_form);

var _submission = require('./submission');

var _submission2 = _interopRequireDefault(_submission);

var _submissions = require('./submissions');

var _submissions2 = _interopRequireDefault(_submissions);

var reducers = {};

function injectReducers(name, src) {
  reducers = _extends({}, reducers, _defineProperty({}, name, (0, _redux.combineReducers)({
    form: (0, _form2['default'])(name, src),
    submission: (0, _submission2['default'])(name, src),
    submissions: (0, _submissions2['default'])(name, src)
  })));
}

function formioReducers() {
  return _extends({}, reducers);
}