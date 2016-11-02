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

export const USER_SUBMISSION_ACCESS = 'USER_SUBMISSION_ACCESS';
function submissionAccessUser(submissionAccess, roles) {
  return {
    type: USER_SUBMISSION_ACCESS,
    submissionAccess,
    roles
  };
}

export const USER_FORM_ACCESS = 'USER_FORM_ACCESS';
function formAccessUser(formAccess) {
  return {
    type: USER_FORM_ACCESS,
    formAccess
  };
}

const getAccess = (dispatch, getState) => {
  const { appUrl } = getState().formio.auth;
  formiojs.makeStaticRequest(appUrl + '/access')
    .then(function(result) {
      let submissionAccess = {};
      Object.keys(result.forms).forEach(key => {
        let form = result.forms[key];
        submissionAccess[form.name] = {};
        form.submissionAccess.forEach(access => {
          submissionAccess[form.name][access.type] = access.roles;
        });
      });
      dispatch(submissionAccessUser(submissionAccess, result.roles));
    })
    .catch(function(err) {
      //console.log(err);
    });
  formiojs.makeStaticRequest(appUrl)
    .then(function(project) {
      let formAccess = {};
      project.access.forEach(access => {
        formAccess[access.type] = access.roles;
      });
      dispatch(formAccessUser(formAccess));
    })
    .catch(function(err) {
      //console.log(err);
    });
};

export const UserActions = {
  fetch: () => {
    return (dispatch, getState) => {
      dispatch(requestUser());

      formiojs.currentUser()
        .then((result) => {
          dispatch(receiveUser(result));
          getAccess(dispatch, getState);
        })
        .catch((result) => {
          dispatch(failUser(result));
        });
    };
  },
  logout: () => {
    return (dispatch, getState) => {
      formiojs.logout()
        .then(() => {
          dispatch(logoutUser());
          getAccess(dispatch, getState);
        });
    };
  }
};
