'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../form/constants');

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _constants[key];
    }
  });
});

var _constants2 = require('../submission/constants');

Object.keys(_constants2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _constants2[key];
    }
  });
});