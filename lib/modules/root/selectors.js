"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var selectRoot = exports.selectRoot = function selectRoot(name, state) {
  return state[name];
};
var selectError = exports.selectError = function selectError(name, state) {
  return selectRoot(name, state).error;
};
var selectIsActive = exports.selectIsActive = function selectIsActive(name, state) {
  return selectRoot(name, state).isActive;
};