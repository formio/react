import React, {Component} from 'react';
import {Formio} from '../../../Formio';
import FormioView from '../../../FormioView';

export default class LoginView extends FormioView {
  component = props => {
    return (
      <div className="panel panel-primary login-container">
        <div className="panel-heading">
          Login
        </div>
        <div className="panel-body">
          <Formio {...props} />
        </div>
      </div>
    );
  }

  mapStateToProps = (state, ownProps) => {
    return {
      src: this.formio.config.projectUrl + '/' + this.formio.auth.config.login.form
    };
  }

  mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onSubmitDone: (submission) => {
        dispatch(this.formio.auth.actions.setUser(submission));
        this.router.push('/' + this.formio.auth.config.authState);
      }
    };
  }
}
