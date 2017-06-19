import * as types from './constants';

export function formReducer(config) {
  return (state = {
    id: '',
    isFetching: false,
    lastUpdated: 0,
    form: {},
    error: ''
  }, action) => {
    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.FORM_REQUEST:
        return {
          ...state,
          isFetching: true,
          id: action.id,
          error: ''
        };
      case types.FORM_SUCCESS:
        return {
          ...state,
          id: action.form._id,
          form: action.form,
          isFetching: false,
          error: ''
        };
      case types.FORM_FAILURE:
        return {
          ...state,
          isFetching: false,
          isInvalid: true,
          error: action.error
        };
      default:
        return state;
    }
  };
};

export function formsReducer(config) {
  return (state = {
    tag: '',
    isFetching: false,
    lastUpdated: 0,
    forms: [],
    limit: 100,
    pagination: {
      page: 1
    },
    error: ''
  }, action) => {
    // Only proceed for this forms.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.FORMS_REQUEST:
        return {
          ...state,
          limit: action.limit || state.limit,
          tag: action.tag,
          isFetching: true,
          pagination: {
            page: action.page || state.pagination.page
          },
          error: ''
        };
      case types.FORMS_SUCCESS:
        return {
          ...state,
          forms: action.forms,
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil(action.forms.serverCount / state.limit),
            total: action.forms.serverCount
          },
          isFetching: false,
          error: ''
        };
      case types.FORMS_FAILURE:
        return {
          ...state,
          isFetching: false,
          isInvalid: true,
          error: action.error
        };
      default:
        return state;
    }
  };
};