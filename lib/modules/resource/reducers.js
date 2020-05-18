'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  return (0, _redux.combineReducers)({
    form: (0, _reducers.formReducer)(config),
    submission: (0, _reducers2.submissionReducer)(config),
    submissions: (0, _reducers2.submissionsReducer)(config)
  });
};

var _redux = require('redux');

var _reducers = require('../form/reducers');

var _reducers2 = require('../submission/reducers');