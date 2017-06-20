import React from 'react';
import FormioView from '../../../FormioView';
import NavLink from '../../../components/NavLink';

export default config => class Resource extends FormioView {
  component = props => {
    return (
      <div>
        <ul className="nav nav-tabs">
          <NavLink exact to={config.name + '/' + props.params[config.name + 'Id']} role="presentation">View</NavLink>
          <NavLink to={config.name + '/' + props.params[config.name + 'Id'] + '/edit'} role="presentation">Edit</NavLink>
          <NavLink to={config.name + '/' + props.params[config.name + 'Id'] + '/delete'} role="presentation"><span className="glyphicon glyphicon-trash" /></NavLink>
        </ul>
        {this.props.children}
      </div>
    );
  }

  initialize = ({dispatch}) => {
    dispatch(this.formio.resources[config.name].actions.submission.get(this.props.params[config.name + 'Id']));
  }
};
