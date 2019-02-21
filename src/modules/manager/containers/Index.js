import React, {Fragment} from 'react';
import FormioView from '../../../FormioView';
import ManagerGrid from './ManagerGrid';

export default config => class extends FormioView {
  query = {};
  page = 1;
  limit = 10;

  component = ({basePath, form, forms, limit, page, sortOrder, isLoading, onSearch, onSort, onPage, onRowClick}) => {
    if (isLoading) {
      return (
        <div className="form-index">
          Loading...
        </div>
      );
    }
    else {
      return (
        <Fragment>
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Search Forms" aria-label="Search Forms" aria-describedby="button-search"/>
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" id="button-search" onClick={onSearch}>Search</button>
            </div>
          </div>
          <ManagerGrid
            forms={forms}
            limit={limit}
            page={this.page}
            sortOrder={sortOrder}
            onSort={onSort}
            onPage={onPage}
            onRowClick={onRowClick}
          />
        </Fragment>
      );
    }
  };

  mapStateToProps = (state, ownProps) => {
    const manager = this.formio.manager[config.name];
    const forms = manager.selectors.getForms(state);
    //const submissions = manager.selectors.getSubmissions(state);

    return {
      basePath: manager.getBasePath(ownProps.params),
      forms: forms.forms,
      page: 1,
      limit: 10,
      sortOrder: this.query.sort,
      isLoading: forms.isFetching
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
    const manager = this.formio.manager[config.name];

    return {
      onSort: (col) => {
        this.toggleSort(col);
        dispatch(this.formio.manager[config.name].actions.submission.index(this.page, this.query));
      },
      onPage: (page) => {
        this.page = page;
        dispatch(this.formio.manager[config.name].actions.form.index('', this.page, this.limit));
      },
      onRowClick: (submission) => {
        this.router.push(manager.getBasePath(ownProps.params) + config.name + '/' + submission._id);
      },
      onSearch: () => {
      }
    };
  };
};
