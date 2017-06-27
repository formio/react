import React, {Component} from 'react';
import {Formio} from '../../../Formio';
import FormioView from '../../../FormioView';

export default class RegisterView extends FormioView {
  component = props => {
    return (
      <Formio {...props} />
    );
  }

  mapStateToProps = (state, ownProps) => {
    return {
      src: this.formio.config.projectUrl + '/' + this.formio.auth.config.register.form
    };
  }

  mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onSubmitDone: (submission) => {
        this.router.push('/' + this.formio.auth.config.authState);
        dispatch(this.formio.auth.actions.setUser(submission));
      }
    };
  }
}
