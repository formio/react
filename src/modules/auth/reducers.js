import * as types from './constants';

export const authReducer = () => {
  const initialState = {
    init: false,
    isFetching: false,
    user: null,
    authenticated: false,
    formAccess: false,
    submissionAccess: false,
    roles: {},
    is: {},
    error: ''
  };

  return (state = initialState, action) => {
    // Only proceed for this user.
    switch (action.type) {
      case types.USER_REQUEST:
        return {
          ...state,
          init: true,
          submissionAccess: false,
          isFetching: true
        };
      case types.USER_REQUEST_SUCCESS:
        return {
          ...state,
          isFetching: false,
          user: action.user,
          authenticated: true,
          error: ''
        };
      case types.USER_REQUEST_FAILURE:
        return {
          ...state,
          isFetching: false,
          error: action.error
        };
      case types.USER_SUBMISSION_ACCESS:
        return {
          ...state,
          submissionAccess: action.submissionAccess,
          roles: action.roles
        };
      case types.USER_FORM_ACCESS:
        return {
          ...state,
          formAccess: action.formAccess
        };
      case types.USER_LOGOUT:
        return {
          ...state,
          user: null,
          isFetching: false,
          authenticated: false,
          error: ''
        };
      default:
        return state;
    }
  };
};
