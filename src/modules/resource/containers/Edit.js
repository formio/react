import React from 'react';
import Form from '../../../components/Form';
import FormioView from '../../../FormioView';

export default config => class Edit extends FormioView {
  component = props => {
    const {isLoading, form, submission, hideComponents, onSubmit} = props;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Form form={form} submission={submission} hideComponents={hideComponents} onSubmit={onSubmit} />
      </div>
    );
  }

  mapStateToProps = (state, ownProps) => {
    const resource = this.formio.resources[config.name];
    const form = resource.selectors.getForm(state);
    const submission = resource.selectors.getSubmission(state);
    return {
      form: form.form,
      submission: submission.submission,
      hideComponents: config.parents,
      isLoading: form.isFetching || submission.isFetching
    };
  }

  mapDispatchToProps = (dispatch, ownProps) => {
    const resource = this.formio.resources[config.name];
    return {
      onSubmit: (submission) => {
        dispatch(resource.actions.submission.save(submission));
        this.router.push(resource.getBasePath(ownProps.params) + config.name + '/' + submission._id);
      }
    };
  }
};
