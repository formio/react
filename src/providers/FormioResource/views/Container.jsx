import React from 'react';
import ReduxView from 'redux-view';
import { Link } from 'react-router';
import { FormActions, SubmissionActions } from '../../actions';

export default function (resource) {
  return class extends ReduxView {
    container = ({ title, params }) => {
      return (
        <div className="form-container">
          <h2>{title}</h2>
          <ul className="nav nav-tabs">
            <li role="presentation">
              <Link to={resource.basePath() + '/' + params[resource.name + 'Id']}>View</Link>
            </li>
            <li role="presentation">
              <Link to={resource.basePath() + '/' + params[resource.name + 'Id'] + '/edit'}>Edit</Link>
            </li>
            <li role="presentation">
              <Link to={resource.basePath() + '/' + params[resource.name + 'Id'] + '/delete'}>Delete</Link>
            </li>
          </ul>
        </div>
      );
    }

    initialize = ({ dispatch }, { params }) => {
      dispatch(FormActions.fetch(resource.name));
      dispatch(SubmissionActions.fetch(resource.name, params[resource.name + 'Id']));
    }

    mapStateToProps = ({ formio }) => {
      return {
        title: formio[resource.name].form.form.title
      };
    }
  };
}
