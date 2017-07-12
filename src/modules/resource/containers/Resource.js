import React from 'react';
import FormioView from '../../../FormioView';
import NavLink from '../../../components/NavLink';

export default config => class Resource extends FormioView {
  component = props => {
    return (
      <div>
        <ul className="nav nav-tabs">
          <NavLink exact to={props.basePath + config.name + '/' + props.params[config.name + 'Id']} role="presentation">View</NavLink>
          <NavLink to={props.basePath + config.name + '/' + props.params[config.name + 'Id'] + '/edit'} role="presentation">Edit</NavLink>
          <NavLink to={props.basePath + config.name + '/' + props.params[config.name + 'Id'] + '/delete'} role="presentation"><span className="glyphicon glyphicon-trash" /></NavLink>
        </ul>
        {props.children}
      </div>
    );
  }

  initialize = ({dispatch}) => {
    const resource = this.formio.resources[config.name];
    dispatch(resource.actions.submission.get(this.props.params[config.name + 'Id']));
  }

  mapStateToProps = (state, ownProps) => {
    const resource = this.formio.resources[config.name];
    return {
      basePath: resource.getBasePath(ownProps.params)
    };
  }
};
