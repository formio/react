import React from 'react';
import {Formio} from '../../../components/Formio';
import FormioView from '../../../FormioView';

export default config => class Create extends FormioView {
  component = props => {
    const {isLoading, form, submission, hideComponents, onSubmit} = props;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h3>New { form.title }</h3>
        <Formio form={form} submission={submission} hideComponents={hideComponents} onSubmit={onSubmit} />
      </div>
    );
  }

  mapStateToProps = (state, ownProps) => {
    const resource = this.formio.resources[config.name];
    const form = resource.selectors.getForm(state);
    const submission = {data: {}};

    config.parents.forEach(parent => {
      submission.data[parent] = this.formio.resources[parent].selectors.getSubmission(state).submission;
    });
    return {
      form: form.form,
      submission,
      hideComponents: config.parents,
      isLoading: form.isFetching
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
