import formiojs from 'formiojs';
import * as types from './constants';

function requestSubmission(name, src) {
  return {
    type: types.SUBMISSION_REQUEST
  };
}

function receiveSubmission(name, submission) {
  return {
    type: types.SUBMISSION_SUCCESS,
    name,
    submission
  };
}

function failSubmission(name, err) {
  return {
    type: types.SUBMISSION_FAILURE,
    name,
    error: err
  };
}

function requestSubmissions(name, page, formId) {
  return {
    type: types.SUBMISSIONS_REQUEST,
    name,
    page,
    formId
  };
}

function receiveSubmissions(name, submissions) {
  return {
    type: types.SUBMISSIONS_SUCCESS,
    submissions,
    name
  };
}

function failSubmissions(name, err) {
  return {
    type: types.SUBMISSIONS_FAILURE,
    error: err,
    name
  };
}

export function submissionActions(config) {
  return {
    get: (id, formId = '') => {
      return (dispatch, getState) => {
        // Check to see if the submission is already loaded.
        if (getState().id === id) {
          return;
        }

        dispatch(requestSubmission(config.name, id, formId));

        const url = formId ? getState().formio[config.name].form.src + '/form/' + formId + '/submission/' + id : getState().formio[name].form.src + '/submission/' + id;
        const formio = formiojs(url);

        formio.loadSubmission()
          .then((result) => {
            dispatch(receiveSubmission(config.name, result));
          })
          .catch((result) => {
            dispatch(failSubmission(config.name, result));
          });
      };
    },
    delete: (name, id, formId) => {
      return (dispatch, getState) => {
        const url = formId ? getState().formio[config.name].form.src + '/form/' + formId + '/submission/' + id : getState().formio[name].form.src + '/submission/' + id;
        const formio = formiojs(url);
        formio.deleteSubmission();

        // TODO: Clear the submission from the store and dispatch an action.
      };
    },
    index: (page = 1, formId = '') => {
      return (dispatch, getState) => {
        dispatch(requestSubmissions(config.name, page, formId));
        const submissions = getState().formio[config.name].submissions;

        let params = {};
        if (parseInt(submissions.limit) !== 10) {
          params.limit = submissions.limit;
        }
        if (page !== 1) {
          params.skip = ((parseInt(page) - 1) * parseInt(submissions.limit));
          params.limit = parseInt(submissions.limit);
        }
        const url = submissions.formId ? submissions.src + '/form/' + submissions.formId : submissions.src;
        const formio = formiojs(url);

        formio.loadSubmissions({params})
          .then((result) => {
            dispatch(receiveSubmissions(config.name, result));
          })
          .catch((result) => {
            dispatch(failSubmissions(config.name.result));
          });
      };
    }
  }
}
