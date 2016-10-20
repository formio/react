import React from 'react';
import ReduxView from 'redux-view';

export default function (builder) {
  return class extends ReduxView {
    container = () => {
      return <div>Builder Index</div>
    }
  };
}
