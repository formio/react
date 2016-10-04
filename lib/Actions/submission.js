'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSubmission = exports.SUBMISSION_FAILURE = exports.SUBMISSION_SUCCESS = exports.SUBMISSION_REQUEST = undefined;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SUBMISSION_REQUEST = exports.SUBMISSION_REQUEST = 'SUBMISSION_REQUEST';
function requestSubmission(name, src) {
  return {
    type: SUBMISSION_REQUEST
  };
}

var SUBMISSION_SUCCESS = exports.SUBMISSION_SUCCESS = 'SUBMISSION_SUCCESS';
function receiveSubmission(submission) {
  return {
    type: SUBMISSION_SUCCESS,
    submission: submission
  };
}

var SUBMISSION_FAILURE = exports.SUBMISSION_FAILURE = 'SUBMISSION_FAILURE';
function failSubmission(err) {
  return {
    type: SUBMISSION_FAILURE,
    error: err
  };
}

var fetchSubmission = exports.fetchSubmission = function fetchSubmission(name, src) {
  return function (dispatch, getState) {
    // Check to see if the submission is already loaded.
    if (getState().submission) {
      return;
    }

    dispatch(requestSubmission(name, src));

    var formio = (0, _formiojs2.default)(src);

    formio.loadSubmission().then(function (result) {
      dispatch(receiveSubmission(result));
    }).catch(function (result) {
      dispatch(failSubmission(result));
    });
  };
};