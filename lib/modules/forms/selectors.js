'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectForms = undefined;

var _root = require('../root');

var selectForms = exports.selectForms = function selectForms(name, state) {
  return (0, _root.selectRoot)(name, state).forms;
};