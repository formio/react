'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.addReducer = addReducer;
exports.formioReducers = formioReducers;

var _redux = require('redux');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reducers = {};

function addReducer(name, reducer) {
  if (reducer) {
    reducers = _extends({}, reducers, _defineProperty({}, name, reducer));
  }
}

function formioReducers() {
  return (0, _redux.combineReducers)(_extends({}, reducers));
}