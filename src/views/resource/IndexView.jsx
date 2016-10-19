import React from 'react';
import { Link } from 'react-router';
import { FormioGrid, FormioView } from '../../components';
import { FormActions, SubmissionActions } from '../../actions';

export default function (resource) {
  return class extends FormioView {
    container = ({ form, submissions, pagination, limit, isFetching, onSortChange, onPageChange, onButtonClick }) => {
      if (isFetching) {
        return (
          <div className="form-index">
            Loading...
          </div>
        );
      }
      else {
        return (
          <div className="form-index">
            <h3>{form.title}s</h3>
            <Link className="btn btn-success" to={resource.basePath() + 'Create'}><i className="glyphicon glyphicon-plus"
                                                                                     aria-hidden="true"></i>
              New {form.title}</Link>
            <FormioGrid
              submissions={submissions}
              form={form}
              onSortChange={onSortChange}
              onPageChange={onPageChange}
              pagination={pagination}
              limit={limit}
              onButtonClick={onButtonClick}
            />
          </div>
        );
      }
    }

    initialize = ({ dispatch }) => {
      dispatch(FormActions.fetch(resource.name));
      dispatch(SubmissionActions.index(resource.name));
    }

    mapStateToProps = ({ formio }) => {
      return {
        form: formio[resource.name].form.form,
        submissions: formio[resource.name].submissions.submissions,
        pagination: formio[resource.name].submissions.pagination,
        limit: formio[resource.name].submissions.limit,
        isFetching: formio[resource.name].submissions.isFetching
      };
    }

    mapDispatchToProps = (dispatch, ownProps, router) => {
      return {
        onSortChange: () => {
        },
        onPageChange: (page) => {
          dispatch(SubmissionActions.index(resource.name, page));
        },
        onButtonClick: (button, id) => {
          switch (button) {
            case 'row':
            case 'view':
              router.transitionTo(resource.basePath() + '/' + id);
              break;
            case 'edit':
              router.transitionTo(resource.basePath() + '/' + id + '/edit');
              break;
            case 'delete':
              router.transitionTo(resource.basePath() + '/' + id + '/delete');
              break;
          }
        }
      };
    }
  }
};