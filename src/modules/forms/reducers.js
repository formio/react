import * as types from './constants';

export function forms(config) {
  const initialState = {
    tag: '',
    isFetching: false,
    lastUpdated: 0,
    forms: [],
    limit: 10,
    pagination: {
      page: 1
    },
    error: ''
  };

  return (state = initialState, action) => {
    // Only proceed for this forms.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.FORMS_RESET:
        return initialState;
      case types.FORMS_REQUEST:
        return {
          ...state,
          limit: action.limit || state.limit,
          tag: config.tag,
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
}
