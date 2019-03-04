import Formiojs from 'formiojs/Formio';
import * as types from './constants';
import {selectSubmissions} from './selectors';

function reset(name) {
  return {
    type: types.SUBMISSIONS_RESET,
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

export const getSubmissions = (name, page = 0, params = {}, formId) => {
  return (dispatch, getState) => {
    dispatch(requestSubmissions(name, page, formId));
    const submissions = selectSubmissions(name, getState());

    if (parseInt(submissions.limit) !== 10) {
      params.limit = submissions.limit;
    }
    if (page !== 0) {
      params.skip = ((parseInt(page)) * parseInt(submissions.limit));
      params.limit = parseInt(submissions.limit);
    }
    else {
      delete params.skip;
    }
    const formio = new Formiojs(Formiojs.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission');

    return formio.loadSubmissions({params})
      .then((result) => {
        dispatch(receiveSubmissions(name, result));
      })
      .catch((result) => {
        dispatch(failSubmissions(name, result));
      });
  };
};

export const resetSubmissions = (name) => {
  return dispatch => dispatch(reset(name));
};
