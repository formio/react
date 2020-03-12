'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectSubmissions = undefined;

var _root = require('../root');

var selectSubmissions = exports.selectSubmissions = function selectSubmissions(name, state) {
  return (0, _root.selectRoot)(name, state).submissions;
};