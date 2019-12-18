import * as types from './constants';

export function form(config) {
  const initialState = {
    error: '',
    form: {},
    options: config.options,
    projectUrl: config.projectUrl,
    id: '',
    isActive: false,
    url: '',
  };

  return (state = initialState, action) => {
    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }

    switch (action.type) {
      case types.FORM_CLEAR_ERROR:
        return {
          ...state,
          error: '',
        };
      case types.FORM_RESET:
        return initialState;
      case types.FORM_REQUEST:
        return {
          ...initialState,
          isActive: true,
        };
      case types.FORM_SAVE:
        return {
          ...state,
          error: '',
          isActive: true,
        };
      case types.FORM_SUCCESS:
        return {
          ...state,
          form: action.form,
          id: action.form._id,
          isActive: false,
          url: action.url,
        };
      case types.FORM_FAILURE:
        return {
          ...state,
          error: action.error,
          isActive: false,
        };
      default:
        return state;
    }
  };
}
