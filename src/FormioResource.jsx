import React from 'react';
import {HashRouter, Match, Link} from 'react-router';
import {connect} from 'react-redux';
import {fetchForm, fetchSubmission, fetchSubmissions} from './actions';
import {injectReducers, injectRoute} from './providers';
import {Formio} from './Formio';
import {FormioGrid} from './FormioGrid';

export class FormioResource {
  constructor(name, src, base = '') {
    this.name = name;
    this.src = src;
    this.base = base;

    injectReducers(name, src);
    injectRoute(this.getRoutes());
  }

  Container = {
    container: ({params}) => {
      return (
        <div className="form-container">
          <h3>Container</h3>
          <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id']}>View</Link>
          <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id'] + '/edit'}>Edit</Link>
          <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id'] + '/delete'}>Delete</Link>
          <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id'} exactly component={this.connectComponent(this.View)} />
          <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id' + '/edit'} exactly component={this.connectComponent(this.Edit)} />
          <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id' + '/delete'} exactly component={this.connectComponent(this.Delete)} />
        </div>
      );
    },
    mapStatetoProps: () => {
      return {};
    },
    mapDispatchToProps: () => {
      return {};
    }
  };

  Index = {
    container: ({form, submissions, pagination, limit, isFetching, onSortChange, onPageChange, onButtonClick}) => {
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
    },
    mapStateToProps: ({formio}) => {
      return {
        form: formio[this.name].form.form,
        submissions: formio[this.name].submissions.submissions,
        pagination: formio[this.name].submissions.pagination,
        limit: formio[this.name].submissions.limit,
        isFetching: formio[this.name].submissions.isFetching
      };
    },
    mapDispatchToProps: (dispatch) => {
      dispatch(fetchForm(this.name));
      dispatch(fetchSubmissions(this.name));
      return {
        onSortChange: () => {},
        onPageChange: (page) => {
          dispatch(fetchSubmissions(this.name, page));
        },
        onButtonClick: (button, id) => {
          console.log(button, id);
        }
      };
    }
  };

  Create = {
    container: ({form, onFormSubmit}) => {
      if (form.isFetching || !form.form) {
        return (
          <div className="form-create">
            Loading...
          </div>
        );
      }
      else {
        return (
          <div className="form-create">
            <Formio src={form.src} form={form.form} onFormSubmit={onFormSubmit} />
          </div>
        );
      }
    },
    mapStateToProps: ({formio}) => {
      return {
        form: formio[this.name].form
      };
    },
    mapDispatchToProps: (dispatch, state) => {
      dispatch(fetchForm(this.name));
      return {
        onFormSubmit: submission => {
          state.history.push(this.name);
        }
      };
    }
  };

  View = {
    container: () => {
      //<Formio src="currentResource.submissionUrl" read-only="true"/>
      return (
        <div className="form-view">
          View
        </div>
      );
    },
    mapStateToProps: (state) => {
      return {
        state
      };
    },
    mapDispatchToProps: (dispatch) => {
      return {
        //dispatch
      };
    }
  };

  Edit = {
    container: () => {
      return (
        <div className="form-edit">
          {/*<Formio src="currentResource.submissionUrl" submission="submission" hide-components="hideComponents"/>*/}
          Edit
        </div>
      );
    },
    mapStateToProps: (state) => {
      return {
        state
      };
    },
    mapDispatchToProps: (dispatch) => {
      return {
        //dispatch
      };
    }
  };

  Delete = {
    container: () => {
      return (
        <div className="form-delete">
          Delete!
        </div>
      );
    },
    mapStateToProps: (state) => {
      return {
        state
      };
    },
    mapDispatchToProps: (dispatch) => {
      return {
        //dispatch
      };
    }
  };

  connectComponent(Component) {
    return connect(
      Component.mapStateToProps,
      Component.mapDispatchToProps
    )(Component.container);
  }

  getRoutes = () => {
    return (
      <div className={this.name}>
        <Match pattern={this.base + '/' + this.name} exactly component={this.connectComponent(this.Index)} />
        <Match pattern={this.base + '/' + this.name + 'Create'} exactly component={this.connectComponent(this.Create)} />
        <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id'} component={this.connectComponent(this.Container)} />
      </div>
    );
  }
}
