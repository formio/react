import React from 'react';
import ReduxView from 'redux-view';
import { Link } from 'react-router';
import { FormActions } from '../../actions';

export default function (builder) {
  return class extends ReduxView {
    container = ({ form }) => {
      return (
        <div className="form-container">
          <h2>{form.title}</h2>
          <ul className="nav nav-tabs">
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + form._id}>
                Enter Data
              </Link>
            </li>
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + form._id + '/submission'} role="presentation">
                View Data
              </Link>
            </li>
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + form._id + '/edit'} role="presentation">
                Edit Form
              </Link>
            </li>
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + form._id + '/actions'} role="presentation">
                Form Actions
              </Link>
            </li>
            <li role="presentation">
              <Link to={builder.options.base + '/form/' + form._id + '/access'} role="presentation">
                Access
              </Link>
            </li>
          </ul>
        </div>
      );
    }

    initialize = ({ dispatch }, { params }) => {
      dispatch(FormActions.fetch(builder.key, params[builder.key + 'Id']));
    }

    mapStateToProps = ({ formio }) => {
      return {
        form: formio[builder.key].form.form,
      };
    }
  };
}
