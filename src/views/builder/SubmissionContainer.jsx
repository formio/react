import React from 'react';
import ReduxView from 'redux-view';
import { Link } from 'react-router';
import { FormActions, SubmissionActions } from '../../actions';

export default function (builder) {
  return class extends ReduxView {
    container = ({ params }) => {
      return (
        <div className="form-container">
          <ul className="nav nav-tabs">
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + params[builder.key + 'Id'] + '/submission/' + params['submissionId']}>View</Link>
            </li>
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + params[builder.key + 'Id'] + '/submission/' + params['submissionId'] + '/edit'}>Edit</Link>
            </li>
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + params[builder.key + 'Id'] + '/submission/' + params['submissionId'] + '/delete'}>Delete</Link>
            </li>
          </ul>
        </div>
      );
    }

    initialize = ({ dispatch }, { params }) => {
      dispatch(SubmissionActions.fetch(builder.key, params['submissionId'], params[builder.key + 'Id']));
    }
  };
}
