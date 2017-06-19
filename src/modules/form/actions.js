import Formiojs from 'formiojs';
import * as types from './constants';
//import { AlertActions } from '../../FormioAlerts/actions';

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

function requestForms(name, tag) {
  return {
    type: types.FORMS_REQUEST,
    name,
    tag
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

export function formActions(form) {
  return {
    get: (id = '') => {
      return (dispatch, getState) => {
        // Check to see if the form is already loaded.
        const root = form.selectors.getForm(getState());
        if (root.form.components && root.form.id === id) {
          return;
        }

        dispatch(requestForm(form.config.name, id));

        const formioForm = new Formiojs(form.config.projectUrl + '/' + form.config.form);

        formioForm.loadForm()
          .then((result) => {
            dispatch(receiveForm(form.config.name, result));
          })
          .catch((result) => {
            console.log(result);
            //dispatch(AlertActions.add({
            //  type: 'danger',
            //  message: result
            //}));
            dispatch(failForm(form.config.name, result));
          });
      };
    },
    index: (tag, page = 1) => {
      return (dispatch, getState) => {
        dispatch(requestForms(form.config.name, tag, page));
        const forms = form.selectors.getForms(getState());

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
        const formio = Formiojs(form.config.projectUrl + '/form');

        formio.loadForms({ params })
          .then((result) => {
            dispatch(receiveForms(form.config.name, result));
          })
          .catch((result) => {
            dispatch(failForms(form.config.name, result));
          });
      };
    }
  }
}
