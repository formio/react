import Formiojs from 'formiojs';
import * as types from './constants';

function requestSubmission(name) {
  return {
    name,
    type: types.SUBMISSION_REQUEST
  };
}

function saveSubmission(name, data) {
  return {
    name,
    type: types.SUBMISSION_SAVE
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

function resetSubmission(name) {
  return {
    type: types.SUBMISSION_RESET,
    name
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

export function submissionActions(form) {
  return {
    get: (id, formId = '') => {
      return (dispatch, getState) => {
        // Check to see if the submission is already loaded.
        if (getState().id === id) {
          return;
        }

        dispatch(requestSubmission(form.config.name, id, formId));

        const formio = new Formiojs(form.config.projectUrl + '/' + form.config.form + '/submission/' + id);

        formio.loadSubmission()
          .then((result) => {
            dispatch(receiveSubmission(form.config.name, result));
          })
          .catch((result) => {
            dispatch(failSubmission(form.config.name, result));
          });
      };
    },
    save: (data) => {
      return (dispatch) => {
        dispatch(saveSubmission(form.config.name, data));

        const formio = new Formiojs(form.config.projectUrl + '/' + form.config.form + '/submission');

        formio.saveSubmission(data)
          .then((result) => {
            dispatch(receiveSubmission(form.config.name, result));
          })
          .catch((result) => {
            dispatch(failSubmission(form.config.name, result));
          });
      };
    },
    delete: (id, formId) => {
      return (dispatch, getState) => {
        const formio = new Formiojs(form.config.projectUrl + '/' + form.config.form + '/submission/' + id);
        formio.deleteSubmission()
          .then(() => {
            dispatch(resetSubmission(form.config.name));
          })
          .catch((result) => {
            dispatch(failSubmission(form.config.name, result));
          });

      };
    },
    index: (page = 0, formId = '') => {
      return (dispatch, getState) => {
        dispatch(requestSubmissions(form.config.name, page, formId));
        const submissions = form.selectors.getSubmissions(getState());

        let params = {};
        if (parseInt(submissions.limit) !== 10) {
          params.limit = submissions.limit;
        }
        if (page !== 0) {
          params.skip = ((parseInt(page)) * parseInt(submissions.limit));
          params.limit = parseInt(submissions.limit);
        }
        const formio = new Formiojs(form.config.projectUrl + '/' + form.config.form + '/submission');

        formio.loadSubmissions({params})
          .then((result) => {
            dispatch(receiveSubmissions(form.config.name, result));
          })
          .catch((result) => {
            dispatch(failSubmissions(form.config.name, result));
          });
      };
    }
  };
}
