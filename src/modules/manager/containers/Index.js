import React, {Fragment} from 'react';
import FormioView from '../../../FormioView';
import Grid from '../../../components/Grid/Grid';

export default config => class extends FormioView {
  query = {};
  page = 1;
  limit = 10;
  createNewLabel = 'Create Form';
  state = {
    regexp: ''
  };
  header = {
    label: 'Title',
    key: 'title',
    sort: 'asc',
    numHeaders: 2
  };
  body = {
    isFormViewAllowed: true,
    isSubmissionIndexAllowed: true,
    isFormEditAllowed: true,
    isFormDeleteAllowed: true
  };
  footer = {
    numHeaders: this.header.numHeaders,
    isCreateAllowed: true,
    createText: 'Create Form',
  };

  handleChange = (event) => {
    this.setState({regexp: event.currentTarget.value});
  };

  component = ({
                 basePath, form, forms,
                 limit, page, sortOrder,
                 isLoading, onSearch, onSort,
                 onPage, onRowClick, onCreateNew,
                 onRowAction, handleChange
  }) => {
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
            <input
              type="text"
              key="search"
              value={this.state.regexp}
              onChange={this.handleChange}
              className="form-control"
              placeholder="Search Forms"
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" id="button-search" onClick={onSearch}>
                <i className="fa fa-search"/>
                Search
              </button>
            </div>
          </div>

          <Grid
            items={forms}
            header={this.header}
            footer={this.footer}
            body={this.body}
            onSort={onSort}
            onPage={onPage}
            onCreateNew={onCreateNew}
            onRowClick={onRowClick}
            onRowAction={onRowAction}
            activePage={this.page}
            firstItem={parseInt(forms.skip) + 1}
            lastItem={parseInt(forms.skip) + parseInt(forms.limit)}
            total={parseInt(forms.serverCount)}
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
        dispatch(this.formio.manager[config.name].actions.form.index(this.page, this.query));
      },
      onPage: (page) => {
        this.page = page;
        dispatch(this.formio.manager[config.name].actions.form.index('', this.page, this.limit));
      },
      onRowClick: (form) => {
        this.router.push(manager.getBasePath(ownProps.params) + config.name + '/' + form._id + '/view');
      },
      onRowAction: (form, actionType) => {
        switch (actionType) {
          case 'view':
            this.router.push(manager.getBasePath(ownProps.params) + config.name + '/' + form._id + '/view');
            break;
          case 'submission':
            this.router.push(manager.getBasePath(ownProps.params) + config.name + '/' + form._id + '/submission');
            break;
          case 'edit':
            this.router.push(manager.getBasePath(ownProps.params) + config.name + '/' + form._id + '/edit');
            break;
          case 'delete':
            this.router.push(manager.getBasePath(ownProps.params) + config.name + '/' + form._id + '/delete');
            break;
        }
      },
      onSearch: () => {
        // dispatch(this.formio.manager[config.name].actions.form.index('', this.page, this.limit, this.regexp));
      },
      onCreateNew: () => {
        this.router.push(manager.getBasePath(ownProps.params) + config.name + '/create');
      }
    };
  };
};
