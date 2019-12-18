import Formiojs from 'formiojs/Formio';

import {selectRoot} from '../root';

import * as types from './constants';

export const resetForms = (name) => ({
  type: types.FORMS_RESET,
  name,
});

const requestForms = (name, page, params) => ({
  type: types.FORMS_REQUEST,
  name,
  page,
  params,
});

const receiveForms = (name, forms) => ({
  type: types.FORMS_SUCCESS,
  name,
  forms,
});

const failForms = (name, error) => ({
  type: types.FORMS_FAILURE,
  name,
  error,
});

export const indexForms = (name, page = 1, params = {}, done = () => {}) => (dispatch, getState) => {
  dispatch(requestForms(name, page, params));

  const {
    limit,
    options,
    projectUrl,
    query,
    select,
    sort,
  } = selectRoot(name, getState());

  const formio = new Formiojs(`${projectUrl || Formiojs.getProjectUrl()}/form`);
  const requestParams = {...query, ...params};

  // Ten is the default so if set to 10, don't send.
  if (limit !== 10) {
    requestParams.limit = limit;
  }
  else {
    delete requestParams.limit;
  }

  if (page === -1) {
    if (params.skip) {
      requestParams.skip = params.skip;
    }
  }
  else if (page !== 1) {
    requestParams.skip = (page - 1) * limit;
  }
  else {
    delete requestParams.skip;
  }

  if (select) {
    requestParams.select = select;
  }
  else {
    delete requestParams.select;
  }

  if (sort) {
    requestParams.sort = sort;
  }
  else {
    delete requestParams.sort;
  }

  return formio.loadForms({params: requestParams}, options)
    .then((result) => {
      const ignoredResult = [];
      ignoredResult.serverCount = result.serverCount;
      dispatch(receiveForms(name, params.ignoreResult ? ignoredResult : result));
      done(null, result);
    })
    .catch((error) => {
      dispatch(failForms(name, error));
      done(error);
    });
};
