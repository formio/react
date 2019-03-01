import * as types from './constants';

export function submissions(config) {
  const initialState = {
    formId: '',
    isActive: false,
    lastUpdated: 0,
    submissions: [],
    limit: 10,
    page: 0,
    error: ''
  };

  return (state = initialState, action) => {
    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.SUBMISSIONS_RESET:
        return initialState;
      case types.SUBMISSIONS_REQUEST:
        return {
          ...state,
          formId: action.formId,
          limit: action.limit || state.limit,
          isActive: true,
          submissions: [],
          page: action.page,
          error: ''
        };
      case types.SUBMISSIONS_SUCCESS:
        return {
          ...state,
          submissions: action.submissions,
          isActive: false,
          error: ''
        };
      case types.SUBMISSIONS_FAILURE:
        return {
          ...state,
          isActive: false,
          error: action.error
        };
      default:
        return state;
    }
  };
}
