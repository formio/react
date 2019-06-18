import Formiojs from 'formiojs/Formio';
import * as types from './constants';
import {selectRoot} from '../root/selectors';

export const resetForms = (name) => ({
  type: types.FORMS_RESET,
  name,
});

const requestForms = (name, page, {
  limit,
  numPages,
  total,
}) => ({
  type: types.FORMS_REQUEST,
  name,
  page,
  limit,
  numPages,
  total,
});

const receiveForms = (name, forms) => ({
  type: types.FORMS_SUCCESS,
  forms,
  name,
});

const failForms = (name, err) => ({
  type: types.FORMS_FAILURE,
  error: err,
  name,
});

export const indexForms = (name, page = 1, params = {}) => {
  return (dispatch, getState) => {
    dispatch(requestForms(name, page, params));
    const forms = selectRoot(name, getState());

    // Ten is the default so if set to 10, don't send.
    if (parseInt(forms.limit) !== 10) {
      params.limit = forms.limit;
    }
    else {
      delete params.limit;
    }

    if (page !== 1) {
      params.skip = ((parseInt(page) - 1) * parseInt(forms.limit));
    }
    else {
      delete params.skip;
    }

    // Apply default query
    params = {...forms.query, ...params};

    const formio = new Formiojs(Formiojs.getProjectUrl() + '/form');

    return formio.loadForms({params})
      .then((result) => {
        dispatch(receiveForms(name, result));
      })
      .catch((result) => {
        dispatch(failForms(name, result));
      });
  };
};
