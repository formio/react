import React from 'react';
import { Formio } from '../../components';
import { FormioView } from '../../providers';
import { FormActions } from '../../actions';

export default function (resource) {
  return class extends FormioView {
    container = ({ pageTitle, form, onFormSubmit }) => {
      let element = null;
      if (form.isFetching || !form.form) {
        element = 'Loading...';
      }
      else {
        element = <Formio src={form.src} form={form.form} onFormSubmit={onFormSubmit}/>;
      }
      return (
        <div className="form-create">
          <h3>{pageTitle}</h3>
          { element }
        </div>
      );
    }

    init = ({ dispatch }) => {
      dispatch(FormActions.fetch(resource.name));
    }

    mapStateToProps = ({formio}) => {
      return {
        form: formio[resource.name].form,
        pageTitle: 'New ' + (formio[resource.name].form.form.title || '')
      };
    }

    mapDispatchToProps = (dispatch, ownProps, router) => {
      return {
        onFormSubmit: submission => {
          router.transitionTo(resource.basePath() + '/' + submission._id);
        }
      };
    }
  };
}
