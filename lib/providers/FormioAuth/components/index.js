'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FormioLogout = require('./FormioLogout');

Object.keys(_FormioLogout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _FormioLogout[key];
    }
  });
});

var _Has = require('./Has');

Object.keys(_Has).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Has[key];
    }
  });
});