import { USER_REQUEST, USER_SUCCESS, USER_FAILURE, USER_LOGOUT, USER_SUBMISSION_ACCESS, USER_FORM_ACCESS } from './actions';

export const authReducer = (appUrl) => {
  const initialState = {
    init: false,
    isFetching: false,
    user: null,
    formAccess: false,
    submissionAccess: false,
    roles: {},
    appUrl: appUrl,
    error: ''
  };

  return (state = initialState, action) => {
    // Only proceed for this user.
    switch (action.type) {
      case USER_REQUEST:
        return {
          ...state,
          init: true,
          submissionAccess: false,
          isFetching: true
        };
      case USER_SUCCESS:
        return {
          ...state,
          user: action.user,
          isFetching: false,
          error: ''
        }
      case USER_SUBMISSION_ACCESS:
        return {
          ...state,
          submissionAccess: action.submissionAccess,
          roles: action.roles
        }
      case USER_FORM_ACCESS:
        return {
          ...state,
          formAccess: action.formAccess
        }
      case USER_FAILURE:
        return {
          ...state,
          isFetching: false,
          error: action.error
        }
      case USER_LOGOUT:
        return {
          ...state,
          user: null,
          isFetching: false,
          error: ''
        }
      default:
        return state;
    }
  };
};
