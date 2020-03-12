'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectSubmission = undefined;

var _root = require('../root');

var selectSubmission = exports.selectSubmission = function selectSubmission(name, state) {
  return (0, _root.selectRoot)(name, state).submission;
};