import React from 'react';
import ReduxView from 'redux-view';
import { Formio } from '../../../components';
import { FormActions, Navigate } from '../../Formio/actions';

export default function (resource) {
  return class extends ReduxView {
    container = ({ pageTitle, form, onFormSubmit }) => {
      let element = null;
      if (form.isFetching || !form.form) {
        element = 'Loading...';
      }
      else {
        element = <Formio src={form.src} form={form.form} submission={submission.submission} onFormSubmit={onFormSubmit}/>;
      }
      return (
        <div className="form-create">
          { (pageTitle) ? <div><h3>{pageTitle}</h3><hr /></div> : ''}
          { element }
        </div>
      );
    }

    initialize = ({ dispatch }) => {
      dispatch(FormActions.fetch(resource.name));
    }

    mapStateToProps = ({ formio }) => {
      return {
        form: formio[resource.name].form,
        pageTitle: 'New ' + (formio[resource.name].form.form.title || '')
      };
    }

    mapDispatchToProps = (dispatch) => {
      return {
        onFormSubmit: submission => {
          dispatch(Navigate.to(resource.basePath() + '/' + submission._id));
        }
      };
    }
  };
}
