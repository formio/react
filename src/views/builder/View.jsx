import React from 'react';
import ReduxView from 'redux-view';
import { Formio } from '../../components';

export default function (builder) {
  return class extends ReduxView {
    container = ({ formUrl }) => {
      return (
        <div className="form-view">
          <Formio src={formUrl} />
        </div>
      );
    }

    mapStateToProps = ({ formio }) => {
      return {
        formUrl: formio[builder.key].form.src + '/form/' + formio[builder.key].form.id
      }
    }
  };
}
