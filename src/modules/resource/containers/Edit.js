import React from 'react';
import {Formio} from '../../../components/Formio';
import FormioView from '../../../FormioView';

export default config => class Edit extends FormioView {
  component = props => {
    const {isLoading, form, submission, hideComponents, onSubmit} = props;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Formio form={form} submission={submission} hideComponents={hideComponents} onSubmit={onSubmit} />
      </div>
    );
  }

  mapStateToProps = (state, ownProps) => {
    const form = this.formio.resources[config.name].selectors.getForm(state);
    const submission = this.formio.resources[config.name].selectors.getSubmission(state);
    return {
      form: form.form,
      submission: submission.submission,
      hideComponents: config.parents,
      isLoading: form.isFetching || submission.isFetching
    };
  }

  mapDispatchToProps = (dispatch) => {
    return {
      onSubmit: (submission) => {
        dispatch(this.formio.resources[config.name].actions.submission.save(submission));
        this.router.push('/' + config.name + '/' + submission._id);
      }
    };
  }
};
