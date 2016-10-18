import React from 'react';
import { Redirect } from 'react-router';
import { Formio } from '../../components';
import { FormioView } from '../../providers';
import { UserActions } from '../../actions';

export default function (auth) {
  return class extends FormioView {
    container = ({ onFormSubmit }) => {
      let loginForm = null;
      let registerForm = null;
      if (auth.loginForm) {
        loginForm = (
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Login</h3>
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-lg-12">
                  <Formio src={auth.appUrl + '/' + auth.loginForm} onFormSubmit={onFormSubmit}></Formio>
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (auth.registerForm) {
        registerForm = (
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Register</h3>
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-lg-12">
                  <Formio src={auth.appUrl + '/' + auth.registerForm} onFormSubmit={onFormSubmit}></Formio>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (loginForm && registerForm) {
        loginForm = (
          <div className="col-md-6">
            {loginForm}
          </div>
        );
        registerForm = (
          <div className="col-md-6">
            {registerForm}
          </div>
        );
      }
      else {
        if (loginForm) {
          loginForm = (
            <div className="col-md-8 col-md-offset-2">
              {loginForm}
            </div>
          );
        }
        if (registerForm) {
          registerForm = (
            <div className="col-md-8 col-md-offset-2">
              {registerForm}
            </div>
          );
        }
      }

      return (
        <div className="formio-auth">
          {loginForm}
          {registerForm}
        </div>
      );
    }

    mapStateToProps = null

    mapDispatchToProps = (dispatch, ownProps, router) => {
      return {
        onFormSubmit: () => {
          dispatch(UserActions.fetch());
          router.transitionTo(auth.authState);
        }
      };
    }
  };
}
