import React from 'react';
import FormioView from '../../../FormioView';

export default config => class Create extends FormioView {
  component = props => {
    return (
      <div className="container">
        {this.props.children}
      </div>
    );
  }

  initialize = ({dispatch}) => {
    dispatch(this.formio.resources[config.name].actions.form.get());
  }
};
