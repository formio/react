'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubmissionActions = exports.SUBMISSIONS_FAILURE = exports.SUBMISSIONS_SUCCESS = exports.SUBMISSIONS_REQUEST = exports.SUBMISSION_FAILURE = exports.SUBMISSION_SUCCESS = exports.SUBMISSION_REQUEST = undefined;

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
function receiveSubmission(name, submission) {
  return {
    type: SUBMISSION_SUCCESS,
    name: name,
    submission: submission
  };
}

var SUBMISSION_FAILURE = exports.SUBMISSION_FAILURE = 'SUBMISSION_FAILURE';
function failSubmission(name, err) {
  return {
    type: SUBMISSION_FAILURE,
    name: name,
    error: err
  };
}

var SUBMISSIONS_REQUEST = exports.SUBMISSIONS_REQUEST = 'SUBMISSIONS_REQUEST';
function requestSubmissions(name, page) {
  return {
    type: SUBMISSIONS_REQUEST,
    name: name,
    page: page
  };
}

var SUBMISSIONS_SUCCESS = exports.SUBMISSIONS_SUCCESS = 'SUBMISSIONS_SUCCESS';
function receiveSubmissions(name, submissions) {
  return {
    type: SUBMISSIONS_SUCCESS,
    submissions: submissions,
    name: name
  };
}

var SUBMISSIONS_FAILURE = exports.SUBMISSIONS_FAILURE = 'SUBMISSIONS_FAILURE';
function failSubmissions(name, err) {
  return {
    type: SUBMISSIONS_FAILURE,
    error: err,
    name: name
  };
}

var SubmissionActions = exports.SubmissionActions = {
  fetch: function fetch(name, id) {
    return function (dispatch, getState) {
      // Check to see if the submission is already loaded.
      if (getState().id === id) {
        return;
      }

      dispatch(requestSubmission(name, id));

      var formio = (0, _formiojs2.default)(getState().formio[name].form.src + '/submission/' + id);

      formio.loadSubmission().then(function (result) {
        dispatch(receiveSubmission(name, result));
      }).catch(function (result) {
        dispatch(failSubmission(name, result));
      });
    };
  },
  index: function index(name) {
    var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    return function (dispatch, getState) {
      dispatch(requestSubmissions(name, page));
      var submissions = getState().formio[name].submissions;

      var params = {};
      if (parseInt(submissions.limit) !== 10) {
        params.limit = submissions.limit;
      }
      if (page !== 1) {
        params.skip = (parseInt(page) - 1) * parseInt(submissions.limit);
        params.limit = parseInt(submissions.limit);
      }
      var formio = (0, _formiojs2.default)(submissions.src);

      formio.loadSubmissions({ params: params }).then(function (result) {
        dispatch(receiveSubmissions(name, result));
      }).catch(function (result) {
        dispatch(failSubmissions(name.result));
      });
    };
  }
};