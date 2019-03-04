import Formiojs from 'formiojs/Formio';
import * as types from './constants';

function requestSubmission(name, id, formId,  url) {
  return {
    name,
    type: types.SUBMISSION_REQUEST,
    id,
    formId,
    url
  };
}

function sendSubmission(name, data) {
  return {
    name,
    type: types.SUBMISSION_SAVE
  };
}

function receiveSubmission(name, submission, url) {
  return {
    type: types.SUBMISSION_SUCCESS,
    name,
    submission,
    url
  };
}

function failSubmission(name, err) {
  return {
    type: types.SUBMISSION_FAILURE,
    name,
    error: err
  };
}

function reset(name) {
  return {
    type: types.SUBMISSION_RESET,
    name
  };
}

export const getSubmission = (name, id, formId, done = () => {}) => {
  return (dispatch, getState) => {
    // Check to see if the submission is already loaded.
    if (getState().id === id) {
      return;
    }

    const url = Formiojs.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission/' + id;

    dispatch(requestSubmission(name, id, formId, url));

    const formio = new Formiojs(url);

    formio.loadSubmission()
      .then((result) => {
        dispatch(receiveSubmission(name, result));
        done(null, result);
      })
      .catch((result) => {
        dispatch(failSubmission(name, result));
        done(result);
      });
  };
};

export const saveSubmission = (name, data, formId, done = () => {}) => {
  return (dispatch) => {
    dispatch(sendSubmission(name, data));

    const id = data._id;

    const formio = new Formiojs(Formiojs.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission' + (id ? '/' + id : ''));

    formio.saveSubmission(data)
      .then((result) => {
        const url = Formiojs.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission/' + result._id;
        dispatch(receiveSubmission(name, result, url));
        done(null, result);
      })
      .catch((result) => {
        dispatch(failSubmission(name, result));
        done(result);
      });
  };
};

export const deleteSubmission = (name, id, formId, done = () => {}) => {
  return (dispatch, getState) => {
    const formio = new Formiojs(Formiojs.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission/' + id);

    return formio.deleteSubmission()
      .then(() => {
        dispatch(reset(name));
        done();
      })
      .catch((result) => {
        dispatch(failSubmission(name, result));
        done(result);
      });
  };
};

export const resetSubmission = (name) => {
  return dispatch => dispatch(reset(name));
};
