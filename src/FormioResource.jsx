import React from 'react';
import {HashRouter, Match, Link, propTypes} from 'react-router';
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

  getContainer = () => {
    return this.connectComponent({
      container: ({params}) => {
        return (
          <div className="form-container">
            <h3>Container</h3>
            <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id']}>View</Link>
            <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id'] + '/edit'}>Edit</Link>
            <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id'] + '/delete'}>Delete</Link>
            <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id'} exactly component={this.getView()} />
            <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id' + '/edit'} exactly component={this.getEdit()} />
            <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id' + '/delete'} exactly component={this.getDelete()} />
          </div>
        );
      },
      mapStatetoProps: () => {
        return {};
      },
      mapDispatchToProps: () => {
        return {};
      }
    });
  };

  getIndex = () => {
    return this.connectComponent({
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
      mapDispatchToProps: (dispatch, ownProps, router) => {
        dispatch(fetchForm(this.name));
        dispatch(fetchSubmissions(this.name));
        return {
          onSortChange: () => {},
          onPageChange: (page) => {
            dispatch(fetchSubmissions(this.name, page));
          },
          onButtonClick: (button, id) => {
            switch(button) {
              case 'row':
              case 'view':
                router.transitionTo(this.base + '/' + this.name + '/' + id + '/view');
                break;
              case 'edit':
                router.transitionTo(this.base + '/' + this.name + '/' + id + '/edit');
                break;
              case 'delete':
                router.transitionTo(this.base + '/' + this.name + '/' + id + '/delete');
                break;
            }
          }
        };
      }
    });
  };

  getCreate = () => {
    return this.connectComponent({
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
    });
  };

  getView = () => {
    return this.connectComponent({
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
    });
  };

  getEdit = () => {
    return this.connectComponent({
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
    });
  };

  getDelete = () => {
    return this.connectComponent({
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
    });
  };

  connectComponent(component) {
    return class extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.router = context.router;
      }

      static contextTypes = {
        router: propTypes.routerContext
      }

      render = () => {
        const Connected = connect(
          component.mapStateToProps,
          // Adds router to the end of mapDispatchToProps.
          (...args) => component.mapDispatchToProps(...args, this.router)
        )(component.container);
        return <div><Connected></Connected></div>;
      }
    }
  }

  old(component) {
    return connect(
      component.mapStateToProps,
      component.mapDispatchToProps
    )(component.container);
  }

  getRoutes = () => {
    return (
      <div className={this.name}>
        <Match pattern={this.base + '/' + this.name} exactly component={this.getIndex()} />
        <Match pattern={this.base + '/' + this.name + 'Create'} exactly component={this.getCreate()} />
        <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id'} component={this.getContainer()} />
      </div>
    );
  }
}
