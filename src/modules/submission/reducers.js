import * as types from './constants';

export function submission({
  name,
}) {
  const initialState = {
    error: '',
    formId: '',
    id: '',
    isActive: false,
    submission: {},
    url: '',
  };

  return (state = initialState, action) => {
    // Only proceed for this form.
    if (action.name !== name) {
      return state;
    }

    switch (action.type) {
      case types.SUBMISSION_RESET:
        return initialState;
      case types.SUBMISSION_REQUEST:
        return {
          ...state,
          error: '',
          formId: action.formId,
          id: action.id,
          isActive: true,
          submission: {},
          url: action.url,
        };
      case types.SUBMISSION_SUCCESS:
        return {
          ...state,
          id: action.submission._id,
          isActive: false,
          submission: action.submission,
        };
      case types.SUBMISSION_FAILURE:
        return {
          ...state,
          error: action.error,
          isActive: false,
        };
      case types.SUBMISSION_SAVE:
        return {
          ...state,
          formId: action.formId,
          id: action.id,
          isActive: true,
          submission: {},
          url: action.url || state.url,
        };
      default:
        return state;
    }
  };
}
