import Formiojs from 'formiojs/Formio';
import * as types from './constants';
import {selectForm} from './selectors';

function requestForm(name, id, url) {
  return {
    type: types.FORM_REQUEST,
    name,
    id,
    url
  };
}

function receiveForm(name, form, url) {
  return {
    type: types.FORM_SUCCESS,
    form,
    name,
    url
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

export const getForm = (name, id = '', done = () => {}) => {
  return (dispatch, getState) => {
    // Check to see if the form is already loaded.
    const form = selectForm(name, getState());
    if (form.components && Array.isArray(form.components) && form.components.length && form._id === id) {
      return;
    }

    const path = `${Formiojs.getProjectUrl()}${id ? `/form/${id}` : name}`;
    const formio = new Formiojs(path);

    dispatch(requestForm(name, id, path));

    return formio.loadForm()
      .then((result) => {
        dispatch(receiveForm(name, result));
        done(null, result);
      })
      .catch((result) => {
        dispatch(failForm(name, result));
        done(result);
      });
  };
};

export const saveForm = (name, form, done = () => {}) => {
  return (dispatch) => {
    dispatch(sendForm(name, form));

    const id = form._id;
    const path = `${Formiojs.getProjectUrl()}/form${id ? `/${id}` : ''}`;
    const formio = new Formiojs(path);

    formio.saveForm(form)
      .then((result) => {
        const url = `${Formiojs.getProjectUrl()}/form/${result._id}`;
        dispatch(receiveForm(name, result, url));
        done(null, result);
      })
      .catch((result) => {
        dispatch(failForm(name, result));
        done(result);
      });
  };
};

export const deleteForm = (name, id, done = () => {}) => {
  return (dispatch) => {
    const path = `${Formiojs.getProjectUrl()}/form/${id}`;
    const formio = new Formiojs(path);

    return formio.deleteForm()
      .then(() => {
        dispatch(reset(name));
        done();
      })
      .catch((result) => {
        dispatch(failForm(name, result));
        done(result);
      });
  };
};

export const resetForm = (name) => {
  return (dispatch) => dispatch(reset(name));
};

