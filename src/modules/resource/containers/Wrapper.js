import React from 'react';
import FormioView from '../../../FormioView';

export default config => class Create extends FormioView {
  component = props => {
    return this.props.children;
  }

  initialize = ({dispatch}) => {
    dispatch(this.formio.resources[config.name].actions.form.get());
  }
};
