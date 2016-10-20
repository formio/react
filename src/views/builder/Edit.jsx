import React from 'react';
import ReduxView from 'redux-view';
import { FormEdit } from '../../components';

export default function (builder) {
  return class extends ReduxView {
    container = ({ form }) => {
      return (
        <div className="form-edit">
          <FormEdit form={form} />
        </div>
      );
    }

    mapStateToProps = ({ formio }) => {
      return {
        form: formio[builder.key].form.form
      };
    }
  };
}
