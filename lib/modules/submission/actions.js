'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteSubmission = exports.saveSubmission = exports.getSubmission = exports.resetSubmission = exports.clearSubmissionError = undefined;

var _Formio = require('formiojs/Formio');

var _Formio2 = _interopRequireDefault(_Formio);

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clearSubmissionError = exports.clearSubmissionError = function clearSubmissionError(name) {
  return {
    type: types.SUBMISSION_CLEAR_ERROR,
    name: name
  };
};

var requestSubmission = function requestSubmission(name, id, formId, url) {
  return {
    type: types.SUBMISSION_REQUEST,
    name: name,
    id: id,
    formId: formId,
    url: url
  };
};

var sendSubmission = function sendSubmission(name, data) {
  return {
    type: types.SUBMISSION_SAVE,
    name: name
  };
};

var receiveSubmission = function receiveSubmission(name, submission, url) {
  return {
    type: types.SUBMISSION_SUCCESS,
    name: name,
    submission: submission,
    url: url
  };
};

var failSubmission = function failSubmission(name, error) {
  return {
    type: types.SUBMISSION_FAILURE,
    name: name,
    error: error
  };
};

var resetSubmission = exports.resetSubmission = function resetSubmission(name) {
  return {
    type: types.SUBMISSION_RESET,
    name: name
  };
};

var getSubmission = exports.getSubmission = function getSubmission(name, id, formId) {
  var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  return function (dispatch, getState) {
    // Check to see if the submission is already loaded.
    if (getState().id === id) {
      return;
    }

    var url = _Formio2.default.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission/' + id;
    var formio = new _Formio2.default(url);

    dispatch(requestSubmission(name, id, formId, url));

    formio.loadSubmission().then(function (result) {
      dispatch(receiveSubmission(name, result));
      done(null, result);
    }).catch(function (error) {
      dispatch(failSubmission(name, error));
      done(error);
    });
  };
};

var saveSubmission = exports.saveSubmission = function saveSubmission(name, data, formId) {
  var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  return function (dispatch) {
    dispatch(sendSubmission(name, data));

    var id = data._id;

    var formio = new _Formio2.default(_Formio2.default.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission' + (id ? '/' + id : ''));

    formio.saveSubmission(data).then(function (result) {
      var url = _Formio2.default.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission/' + result._id;
      dispatch(receiveSubmission(name, result, url));
      done(null, result);
    }).catch(function (error) {
      dispatch(failSubmission(name, error));
      done(error);
    });
  };
};

var deleteSubmission = exports.deleteSubmission = function deleteSubmission(name, id, formId) {
  var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  return function (dispatch, getState) {
    var formio = new _Formio2.default(_Formio2.default.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission/' + id);

    return formio.deleteSubmission().then(function () {
      dispatch(resetSubmission(name));
      done(null, true);
    }).catch(function (error) {
      dispatch(failSubmission(name, error));
      done(error);
    });
  };
};