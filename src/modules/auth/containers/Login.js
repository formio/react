import React from 'react';
import {Formio} from '../../../components/Formio';
import FormioView from '../../../FormioView';

export default class LoginView extends FormioView {
  component = props => {
    return (
      <Formio {...props} />
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
