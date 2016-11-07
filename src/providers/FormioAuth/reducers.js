import { fromJS } from 'immutable';
import { USER_REQUEST, USER_SUCCESS, USER_FAILURE, USER_LOGOUT, USER_SUBMISSION_ACCESS, USER_FORM_ACCESS } from './actions';

export const authReducer = (appUrl) => {
  const initialState = fromJS({
    init: false,
    isFetching: false,
    user: null,
    formAccess: false,
    submissionAccess: false,
    roles: {},
    appUrl: appUrl,
    error: ''
  });

  return (state = initialState, action) => {
    // Only proceed for this user.
    switch (action.type) {
      case USER_REQUEST:
        return state
          .set('init', true)
          .set('submissionAccess', false)
          .set('isFetching', true);
      case USER_SUCCESS:
        return state
          .set('user', action.user)
          .set('isFetching', false)
          .set('error', '');
      case USER_SUBMISSION_ACCESS:
        return state
          .set('submissionAccess', action.submissionAccess)
          .set('roles', action.roles);
      case USER_FORM_ACCESS:
        return state
          .set('formAccess', action.formAccess);
      case USER_FAILURE:
        return state
          .set('isFetching', false)
          .set('error', action.error);
      case USER_LOGOUT:
        return state
          .set('user', null)
          .set('isFetching', false)
          .set('error', '');
      default:
        return state;
    }
  };
};
