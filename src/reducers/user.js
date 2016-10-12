import { USER_REQUEST, USER_SUCCESS, USER_FAILURE } from '../actions';

export default () => {
  return (state = {
    isFetching: false,
    lastUpdated: 0,
    user: null,
    error: ''
  }, action) => {
    // Only proceed for this user.
    switch (action.type) {
      case USER_REQUEST:
        return {
          ...state,
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
          isInvalid: true,
          error: action.error
        };
      default:
        return state;
    }
  };
};
