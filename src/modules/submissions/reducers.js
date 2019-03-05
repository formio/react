import * as types from './constants';

export function submissions(config) {
  const initialState = {
    formId: '',
    isActive: false,
    lastUpdated: 0,
    submissions: [],
    limit: 10,
    pagination: {
      page: 1
    },
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
          pagination: {
            page: action.page || state.pagination.page,
            numPages: action.numPages || state.pagination.numPages,
            total: action.total || state.pagination.total
          },
          error: ''
        };
      case types.SUBMISSIONS_SUCCESS:
        return {
          ...state,
          submissions: action.submissions,
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil((action.submissions.serverCount || state.pagination.total) / state.limit),
            total: action.submissions.serverCount || state.pagination.total
          },
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
