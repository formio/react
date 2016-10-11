import formiojs from 'formiojs';

export const FORM_REQUEST = 'FORM_REQUEST';
function requestForm(name) {
  return {
    type: FORM_REQUEST,
    name
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

export const FormActions = {
  fetch: (name) => {
    return (dispatch, getState) => {
      // Check to see if the form is already loaded.
      if (getState().formio[name].form.form.components) {
        return;
      }

      dispatch(requestForm(name));

      const formio = formiojs(getState().formio[name].form.src);

      formio.loadForm()
        .then((result) => {
          dispatch(receiveForm(name, result));
        })
        .catch((result) => {
          dispatch(failForm(name, result));
        });
    };
  },
  index: () => {

  }
}