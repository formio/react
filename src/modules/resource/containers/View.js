import React from 'react';
import Form from '../../../components/Form';
import FormioView from '../../../FormioView';

export default config => class View extends FormioView {
  component = props => {
    const {isLoading, form, submission, hideComponents} = props;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Form form={form} submission={submission} hideComponents={hideComponents} options={{readOnly: true, noAlerts: true}} />
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
};
