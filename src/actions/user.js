import formiojs from 'formiojs';

export const USER_REQUEST = 'USER_REQUEST';
function requestUser() {
  return {
    type: USER_REQUEST
  };
}

export const USER_SUCCESS = 'USER_SUCCESS';
function receiveUser(user) {
  return {
    type: USER_SUCCESS,
    user
  };
}

export const USER_FAILURE = 'USER_FAILURE';
function failUser(err) {
  return {
    type: USER_FAILURE,
    error: err
  };
}

export const USER_LOGOUT = 'USER_LOGOUT';
function logoutUser() {
  return {
    type: USER_LOGOUT
  };
}

export const UserActions = {
  fetch: () => {
    return (dispatch) => {
      dispatch(requestUser());

      formiojs.currentUser()
        .then((result) => {
          dispatch(receiveUser(result));
        })
        .catch((result) => {
          dispatch(failUser(result));
        });
    };
  },
  logout: () => {
    return (dispatch) => {
      dispatch(logoutUser());

      formiojs.logout();
    }
  }
};
