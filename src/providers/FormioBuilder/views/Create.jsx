import React from 'react';
import ReduxView from 'redux-view';
import { FormEdit } from '../../components';
import { FormActions } from '../../actions';

export default function (builder) {
  return class extends ReduxView {
    container = () => {
      return (
        <div className="form-create">
          <h2>Create a Form</h2>
          <FormEdit form={{}} />
        </div>
      );
    }
  };
}
