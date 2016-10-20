import React from 'react';
import ReduxView from 'redux-view';

export default function (builder) {
  return class extends ReduxView {
    container = () => {
      return (
        <div className="form-submissions">
          <h3>Delete</h3>
        </div>
      );
    }
  };
}
