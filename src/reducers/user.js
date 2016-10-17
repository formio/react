import { USER_REQUEST, USER_SUCCESS, USER_FAILURE, USER_LOGOUT } from '../actions';

export default () => {
  return (state = {
    init: false,
    isFetching: false,
    user: null,
    error: ''
  }, action) => {
    // Only proceed for this user.
    switch (action.type) {
      case USER_REQUEST:
        return {
          ...state,
          init: true,
          isFetching: true,
        };
      case USER_SUCCESS:
        return {
          ...state,
          user: action.user,
          isFetching: false,
          error: ''
        };
      case USER_FAILURE:
        return {
          ...state,
          isFetching: false,
          error: action.error
        };
      case USER_LOGOUT:
        return {
          ...state,
          user: null,
          isFetching: false,
          error: ''
        };
      default:
        return state;
    }
  };
};
