import React from 'react';
import ReduxView from 'redux-view';

export default function (builder) {
  return class extends ReduxView {
    container = () => {
      return (
        <div className="form-access">
          <h3>Access</h3>
        </div>
      );
    }
  };
}
