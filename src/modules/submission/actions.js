import Formiojs from 'formiojs';
import * as types from './constants';

function requestSubmission(name) {
  return {
    name,
    type: types.SUBMISSION_REQUEST
  };
}

function sendSubmission(name, data) {
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

export const getSubmission = (name, id, options) => {
  return (dispatch, getState) => {
    // Check to see if the submission is already loaded.
    if (getState().id === id) {
      return;
    }

    dispatch(requestSubmission(name, id, options.formId));

    const formio = new Formiojs(options.project + '/' + (options.formId ? 'form/' + options.formId : name) + '/submission/' + id);

    formio.loadSubmission()
      .then((result) => {
        dispatch(receiveSubmission(name, result));
      })
      .catch((result) => {
        dispatch(failSubmission(name, result));
      });
  };
};

export const saveSubmission = (name, data, options) => {
  return (dispatch) => {
    dispatch(sendSubmission(name, data));

    const id = data._id;

    const formio = new Formiojs(options.project + '/' + (options.formId ? 'form/' + options.formId : name) + '/submission' + (id ? '/' + id : ''));

    formio.saveSubmission(data)
      .then((result) => {
        dispatch(receiveSubmission(name, result));
      })
      .catch((result) => {
        dispatch(failSubmission(name, result));
      });
  };
};

export const deleteSubmission = (name, id, options) => {
  return (dispatch, getState) => {
    const formio = new Formiojs(options.project + '/' + (options.formId ? 'form/' + options.formId : name) + '/submission/' + id);

    return formio.deleteSubmission()
      .then(() => {
        dispatch(resetSubmission(name));
      })
      .catch((result) => {
        dispatch(failSubmission(name, result));
      });
  };
};
