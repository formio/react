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

export const indexForms = (name, page = 1, params = {}) => {
  return (dispatch, getState) => {
    dispatch(requestForms(name, page));
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
    params = {...params, ...forms.query};

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

export const resetForms = (name) => {
  return dispatch => dispatch(reset(name));
};
