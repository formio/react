import React from 'react';
import Formio from 'react-formio';

export default ({form, onFormSubmit}) => {
  if (!form.isFetching && form.form) {
    return (
      <div className="form-create">
        <Formio src={form.src} form={form.form} onFormSubmit={onFormSubmit} />
      </div>
    );
  }
  else {
    return (
      <div className="form-create">
        Loading...
      </div>
    );
  }
};
