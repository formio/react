'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSubmissions = exports.SUBMISSIONS_FAILURE = exports.SUBMISSIONS_SUCCESS = exports.SUBMISSIONS_REQUEST = undefined;

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var fetchSubmissions = exports.fetchSubmissions = function fetchSubmissions(name) {
  var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  return function (dispatch, getState) {
    dispatch(requestSubmissions(name, page));
    var submissions = getState().formio[name].submissions;

    var params = {};
    if (submissions.limit != 10) {
      params.limit = submissions.limit;
    }
    if (page !== 1) {
      params.skip = (parseInt(page) - 1) * submissions.limit;
      params.limit = submissions.limit;
    }
    var formio = (0, _formiojs2.default)(submissions.src);

    formio.loadSubmissions({ params: params }).then(function (result) {
      dispatch(receiveSubmissions(name, result));
    }).catch(function (result) {
      dispatch(failSubmissions(name.result));
    });
  };
};