import React from 'react';
import FormioView from '../../../FormioView';
import {Link} from 'react-router';
import SubmissionGrid from '../../submission/containers/SubmissionGrid';

export default config => class extends FormioView {
  query = {};
  page = 0;

  component = ({form, submissions, limit, page, sortOrder, isLoading, onSort, onPage, onRowClick}) => {
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
            limit={limit}
            page={page}
            sortOrder={sortOrder}
            onSort={onSort}
            onPage={onPage}
            onRowClick={onRowClick}
          />
          <Link className="btn btn-primary" to={'/' + config.name + '/new'}>
            <i className="glyphicon glyphicon-plus" aria-hidden="true"></i>
            New {form.title}
          </Link>
        </div>
      );
    }
  };

  initialize = ({dispatch}, {params}) => {
    if (config.parents.length) {
      config.parents.forEach(parent => {
        if (params[parent + 'Id']) {
          this.query['data.' + parent] = params[parent + 'Id'];
        }
      });
    }
    dispatch(this.formio.resources[config.name].actions.submission.index(0, this.query));
  };

  mapStateToProps = (state) => {
    const form = this.formio.resources[config.name].selectors.getForm(state);
    const submissions = this.formio.resources[config.name].selectors.getSubmissions(state);

    return {
      form: form.form,
      submissions: submissions.submissions,
      page: submissions.page,
      limit: submissions.limit,
      sortOrder: this.query.sort,
      isLoading: form.isFetching || submissions.isFetching
    };
  };

  toggleSort = (field) => {
    if (!this.query.sort) {
      return this.query.sort = field;
    }
    const currentSort = this.query.sort[0] === '-' ? this.query.sort.slice(1, this.query.sort.length) : this.query.sort;
    if (currentSort !== field) {
      this.query.sort = field;
    }
    else if (this.query.sort[0] !== '-') {
      this.query.sort = '-' + field;
    }
    else {
      delete this.query.sort;
    }
  };

  mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onSort: (col) => {
        this.toggleSort(col);
        dispatch(this.formio.resources[config.name].actions.submission.index(this.page, this.query));
      },
      onPage: (page) => {
        this.page = page - 1;
        dispatch(this.formio.resources[config.name].actions.submission.index(this.page, this.query));
      },
      onRowClick: (submission) => {
        this.router.push('/' + config.name + '/' + submission._id);
      }
    };
  };
};
