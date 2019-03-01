import formiojs from 'formiojs/Formio';
import * as types from './constants';

const requestUser = () => ({
  type: types.USER_REQUEST
});

const receiveUser = user => ({
  type: types.USER_REQUEST_SUCCESS,
  user
});

const failUser = err => ({
  type: types.USER_REQUEST_FAILURE,
  err
});

const logoutUser = () => ({
  type: types.USER_LOGOUT
});

const submissionAccessUser = (submissionAccess, roles) => ({
  type: types.USER_SUBMISSION_ACCESS,
  submissionAccess,
  roles
});

const formAccessUser = formAccess => ({
  type: types.USER_FORM_ACCESS,
  formAccess
});

const getAccess = (dispatch, projectUrl) => {
  formiojs.makeStaticRequest(projectUrl + '/access')
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
      //console.error(err);
    });
  formiojs.makeStaticRequest(projectUrl)
    .then(function(project) {
      let formAccess = {};
      project.access.forEach(access => {
        formAccess[access.type] = access.roles;
      });
      dispatch(formAccessUser(formAccess));
    })
    .catch(function(err) {
      //console.error(err);
    });
};

export const initAuth = (options) => {
  return (dispatch) => {
    dispatch(requestUser());

    formiojs.currentUser()
      .then(user => {
        if (user) {
          dispatch(receiveUser(user));
          getAccess(dispatch, options.project);
        }
      })
      .catch(result => {
        dispatch(failUser(result));
      });
  };
};

export const setUser = (user, options) => {
  formiojs.setUser(user);
  return (dispatch) => {
    dispatch(receiveUser(user));
    getAccess(dispatch, options.project);
  };
};

export const logout = (options) => {
  return (dispatch, getState) => {
    formiojs.logout()
      .then(() => {
        dispatch(logoutUser());
        getAccess(dispatch, options.project);
      });
  };
};
