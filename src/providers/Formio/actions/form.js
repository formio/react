import formiojs from 'formiojs';
import { AlertActions } from '../../FormioAlerts/actions';

export const FORM_REQUEST = 'FORM_REQUEST';
function requestForm(name, id) {
  return {
    type: FORM_REQUEST,
    name,
    id
  };
}

export const FORM_SUCCESS = 'FORM_SUCCESS';
function receiveForm(name, form) {
  return {
    type: FORM_SUCCESS,
    form,
    name
  };
}

export const FORM_FAILURE = 'FORM_FAILURE';
function failForm(name, err) {
  return {
    type: FORM_FAILURE,
    error: err,
    name
  };
}

export const FORMS_REQUEST = 'FORMS_REQUEST';
function requestForms(name, tag) {
  return {
    type: FORMS_REQUEST,
    name,
    tag
  };
}

export const FORMS_SUCCESS = 'FORMS_SUCCESS';
function receiveForms(name, forms) {
  return {
    type: FORMS_SUCCESS,
    forms,
    name
  };
}

export const FORMS_FAILURE = 'FORMS_FAILURE';
function failForms(name, err) {
  return {
    type: FORMS_FAILURE,
    error: err,
    name
  };
}

export const FormActions = {
  fetch: (name, id = '') => {
    return (dispatch, getState) => {
      // Check to see if the form is already loaded.
      const { formio } = getState();
      if (formio[name].form.form.components && formio[name].form.id === id) {
        return;
      }

      dispatch(requestForm(name, id));

      const path = formio[name].form.src + (id ? '/form/' + id : '');
      const formioForm = formiojs(path);

      formioForm.loadForm()
        .then((result) => {
          dispatch(receiveForm(name, result));
        })
        .catch((result) => {
          dispatch(AlertActions.add({
            type: 'danger',
            message: result
          }));
          dispatch(failForm(name, result));
        });
    };
  },
  index: (name, tag, page = 1) => {
    return (dispatch, getState) => {
      dispatch(requestForms(name, tag, page));
      const forms = getState().formio[name].forms;

      let params = {};
      if (tag) {
        params.tags = tag;
      }
      if (parseInt(forms.limit) !== 10) {
        params.limit = forms.limit;
      }
      if (page !== 1) {
        params.skip = ((parseInt(page) - 1) * parseInt(forms.limit));
        params.limit = parseInt(forms.limit);
      }
      const formio = formiojs(forms.src);

      formio.loadForms({ params })
        .then((result) => {
          dispatch(receiveForms(name, result));
        })
        .catch((result) => {
          dispatch(failForms(name. result));
        });
    };
  }
};
