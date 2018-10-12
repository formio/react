import React from 'react';
import Form from '../../../components/Form';
import FormioView from '../../../FormioView';

export default class LoginView extends FormioView {
  component = props => {
    return (
      <Form {...props} />
    );
  }

  mapStateToProps = () => {
    return {
      src: this.formio.config.projectUrl + '/' + this.formio.auth.config.login.form
    };
  }

  mapDispatchToProps = (dispatch) => {
    return {
      onSubmitDone: (submission) => {
        this.router.push('/' + this.formio.auth.config.authState);
        dispatch(this.formio.auth.actions.setUser(submission));
      }
    };
  }
}
