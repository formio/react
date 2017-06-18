import React, {Component} from 'react';
import {Formio} from '../../../Formio';
import FormioView from '../../../FormioView';

export default class RegisterView extends FormioView {
  component = props => {
    return (
      <div className="panel panel-primary register-container">
        <div className="panel-heading">
          Register
        </div>
        <div className="panel-body">
          <Formio {...props} />
        </div>
      </div>
    );
  }

  mapStateToProps = (state, ownProps) => {
    return {
      src: this.formio.config.projectUrl + '/' + this.formio.auth.config.register.form
    };
  }

  mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onSubmitDone: () => {
        /* eslint-disable no-console */
        console.log('submit');
      }
    };
  }
}
