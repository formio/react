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
    const form = this.formio.resources[config.name].selectors.getForm(state);
    return {
      form: form.form,
      submission: {},
      hideComponents: config.parents,
      isLoading: form.isFetching
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
