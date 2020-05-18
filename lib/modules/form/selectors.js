'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectForm = undefined;

var _root = require('../root');

var selectForm = exports.selectForm = function selectForm(name, state) {
  return (0, _root.selectRoot)(name, state).form;
};