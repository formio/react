import React from 'react';
import FormioView from '../../../FormioView';

export default class Create extends FormioView {
  component = props => {
    return (
      <div className="container">
        <h1>Resource</h1>
        {this.props.children}
      </div>
    );
  }
}
