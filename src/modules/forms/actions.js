import Formiojs from 'formiojs/Formio';
import * as types from './constants';
import {selectRoot} from '../root/selectors';

function reset(name) {
  return {
    type: types.FORMS_RESET,
    name
  };
}

function requestForms(name, page) {
  return {
    type: types.FORMS_REQUEST,
    name,
    page
  };
}

function receiveForms(name, forms) {
  return {
    type: types.FORMS_SUCCESS,
    forms,
    name
  };
}

function failForms(name, err) {
  return {
    type: types.FORMS_FAILURE,
    error: err,
    name
  };
}

export const indexForms = (name, page = 1, params = {}, options) => {
  return (dispatch, getState) => {
    dispatch(requestForms(name, page));
    const forms = selectRoot('forms', getState());

    if (parseInt(forms.limit) !== 10) {
      params.limit = forms.limit;
    }
    if (page !== 1) {
      params.skip = ((parseInt(page) - 1) * parseInt(forms.limit));
      params.limit = parseInt(forms.limit);
    }
    const formio = new Formiojs(options.project + '/form');

    return formio.loadForms({params})
      .then((result) => {
        dispatch(receiveForms(name, result));
      })
      .catch((result) => {
        dispatch(failForms(name, result));
      });
  };
};

export const resetForms = (name) => {
  return dispatch => dispatch(reset(name));
};
