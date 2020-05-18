'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (resource) {
  return {
    form: (0, _actions.formActions)(resource),
    submission: (0, _actions2.submissionActions)(resource)
  };
};

var _actions = require('../form/actions');

var _actions2 = require('../submission/actions');