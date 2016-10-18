import React from 'react';
import { Link, Match } from 'react-router';
import { FormioView } from '../../components';
import { FormActions, SubmissionActions } from '../../actions';

export default function (resource) {
  return class extends FormioView {
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
          <Match pattern={resource.basePath() + '/:' + resource.name + 'Id'} exactly component={resource.View(resource)} />
          <Match pattern={resource.basePath() + '/:' + resource.name + 'Id' + '/edit'} exactly component={resource.Edit(resource)} />
          <Match pattern={resource.basePath() + '/:' + resource.name + 'Id' + '/delete'} exactly component={resource.Delete(resource)} />
        </div>
      );
    }

    init = ({ dispatch }, { params }) => {
      dispatch(FormActions.fetch(resource.name));
      dispatch(SubmissionActions.fetch(resource.name, params[resource.name + 'Id']));
    }

    mapStateToProps = ({ formio }) => {
      return {
        title: formio[resource.name].form.form.title
      };
    }

    mapDispatchToProps = () => {return {};}
  };
}
