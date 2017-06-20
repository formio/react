import React from 'react';
import FormioView from '../../../FormioView';
import {Link} from 'react-router';
import SubmissionGrid from '../../submission/containers/SubmissionGrid';

export default config => class extends FormioView {
  component = ({form, submissions, pagination, limit, isLoading, onSortChange, onPageChange, onRowClick}) => {
    if (isLoading) {
      return (
        <div className="form-index">
          Loading...
        </div>
      );
    }
    else {
      return (
        <div className="form-index">
          <SubmissionGrid
            submissions={submissions}
            form={form}
            onSortChange={onSortChange}
            onPageChange={onPageChange}
            pagination={pagination}
            limit={limit}
            onRowClick={onRowClick}
          />
          <Link className="btn btn-primary" to={'/' + config.name + '/new'}>
            <i className="glyphicon glyphicon-plus" aria-hidden="true"></i>
            New {form.title}
          </Link>
        </div>
      );
    }
  }

  initialize = ({dispatch}) => {
    dispatch(this.formio.resources[config.name].actions.submission.index());
  }

  mapStateToProps = (state) => {
    const form = this.formio.resources[config.name].selectors.getForm(state);
    const submissions = this.formio.resources[config.name].selectors.getSubmissions(state);
    return {
      form: form.form,
      submissions: submissions.submissions,
      //pagination: root.submissions.pagination,
      //limit: root.submissions.limit,
      isLoading: form.isFetching || submissions.isFetching
    };
  }

  mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onSortChange: () => {
      },
      onPageChange: (page) => {
        //dispatch(SubmissionActions.index(config.name, page));
      },
      onRowClick: (submission) => {
        this.router.push('/' + config.name + '/' + submission._id);
      }
    };
  }
};
