import * as types from './constants';

export function submissionReducer(config) {
  return (state = {
    formId: '',
    id: '',
    isFetching: false,
    lastUpdated: 0,
    submission: {},
    error: ''
  }, action) => {
    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.SUBMISSION_REQUEST:
        return {
          ...state,
          formId: action.formId,
          id: action.id,
          submission: {},
          isFetching: true,
        };
      case types.SUBMISSION_SAVE:
        return {
          ...state,
          formId: action.formId,
          id: action.id,
          submission: {},
          isFetching: true,
        };
      case types.SUBMISSION_SUCCESS:
        return {
          ...state,
          id: action.submission._id,
          submission: action.submission,
          isFetching: false,
          error: ''
        };
      case types.SUBMISSION_FAILURE:
        return {
          ...state,
          isFetching: false,
          isInvalid: true,
          error: action.error
        };
      case types.SUBMISSION_RESET:
        return {
          ...state,
          id: '',
          isFetching: false,
          lastUpdated: 0,
          submission: {},
          error: ''
        };
      default:
        return state;
    }
  };
}

export function submissionsReducer(config) {
  return (state = {
    formId: '',
    isFetching: false,
    lastUpdated: 0,
    submissions: [],
    limit: 10,
    page: 0,
    error: ''
  }, action) => {
    // Only proceed for this form.
    if (action.name !== config.name) {
      return state;
    }
    switch (action.type) {
      case types.SUBMISSIONS_REQUEST:
        return {
          ...state,
          formId: action.formId,
          limit: action.limit || state.limit,
          isFetching: true,
          submissions: [],
          page: action.page,
          error: ''
        };
      case types.SUBMISSIONS_SUCCESS:
        return {
          ...state,
          submissions: action.submissions,
          isFetching: false,
          error: ''
        };
      case types.SUBMISSIONS_FAILURE:
        return {
          ...state,
          isFetching: false,
          error: action.error
        };
      default:
        return state;
    }
  };
}
