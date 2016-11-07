'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FormioAuth = require('./FormioAuth');

Object.keys(_FormioAuth).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _FormioAuth[key];
    }
  });
});