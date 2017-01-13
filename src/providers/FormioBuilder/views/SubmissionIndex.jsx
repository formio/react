import React from 'react';
import ReduxView from 'redux-view';
import { FormioGrid } from '../../components';
import { SubmissionActions } from '../../actions';

export default function (builder) {
  return class extends ReduxView {
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

    initialize = ({ dispatch }, { params }) => {
      dispatch(SubmissionActions.index(builder.key, 1, params[builder.key + 'Id']));
    }

    mapStateToProps = ({ formio }) => {
      return {
        form: formio[builder.key].form.form,
        submissions: formio[builder.key].submissions.submissions,
        pagination: formio[builder.key].submissions.pagination,
        limit: formio[builder.key].submissions.limit,
        isFetching: formio[builder.key].submissions.isFetching
      };
    }

    mapDispatchToProps = (dispatch, { params }, router) => {
      const formId = params[builder.key + 'Id'];
      return {
        onSortChange: () => {
        },
        onPageChange: (page) => {
          dispatch(SubmissionActions.index(builder.key, page, formId));
        },
        onButtonClick: (button, submissionId) => {
          switch (button) {
            case 'row':
            case 'view':
              router.transitionTo(builder.options.base +  '/form/' + formId + '/submission/' + submissionId);
              break;
            case 'edit':
              router.transitionTo(builder.options.base +  '/form/' + formId + '/submission/' + submissionId + '/edit');
              break;
            case 'delete':
              router.transitionTo(builder.options.base +  '/form/' + formId + '/submission/' + submissionId + '/delete');
              break;
          }
        }
      };
    }
  };
}
