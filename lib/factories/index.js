'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FormioComponents = require('./FormioComponents');

Object.keys(_FormioComponents).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _FormioComponents[key];
    }
  });
});