import Formiojs from 'formiojs/Formio';
import * as types from './constants';
import {selectForm} from './selectors';

function requestForm(name, id) {
  return {
    type: types.FORM_REQUEST,
    name,
    id
  };
}

function receiveForm(name, form) {
  return {
    type: types.FORM_SUCCESS,
    form,
    name
  };
}

function failForm(name, err) {
  return {
    type: types.FORM_FAILURE,
    error: err,
    name
  };
}

function reset(name) {
  return {
    type: types.FORM_RESET,
    name
  };
}

function sendForm(name, form) {
  return {
    type: types.FORM_SAVE,
    form,
    name
  };
}

export const getForm = (name, id = '', options) => {
  return (dispatch, getState) => {
    // Check to see if the form is already loaded.
    const form = selectForm(name, getState());
    if (form.components && Array.isArray(form.components) && form.components.length && form._id === id) {
      return;
    }

    dispatch(requestForm(name, id));

    const formPath = id ? `/form/${id}` : `/${name}`;

    const formio = new Formiojs(options.project + '/' + formPath);

    return formio.loadForm()
      .then((result) => {
        dispatch(receiveForm(name, result));
      })
      .catch((result) => {
        dispatch(failForm(name, result));
      });
  };
};

export const saveForm = (name, form, options) => {
  return (dispatch) => {
    dispatch(sendForm(name, form));

    const id = form._id;

    const formio = new Formiojs(options.project + '/form' + (id ? '/' + id : ''));

    formio.saveForm(form)
      .then((result) => {
        dispatch(receiveForm(name, result));
      })
      .catch((result) => {
        dispatch(failForm(name, result));
      });
  };
};

export const deleteForm = (name, id, options) => {
  return (dispatch) => {
    const formio = new Formiojs(options.project + '/form/' + id);

    return formio.deleteForm()
      .then(() => {
        dispatch(reset(name));
      })
      .catch((result) => {
        dispatch(failForm(name, result));
      });
  };
};

export const resetForm = (name) => {
  return (dispatch) => dispatch(reset(name));
};

