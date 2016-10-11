import React from 'react';
import { HashRouter, Match, Link, propTypes } from 'react-router';
import { connect } from 'react-redux';
import { FormActions, SubmissionActions } from './actions';
import { injectReducers, injectRoute } from './providers';
import { Formio } from './Formio';
import { FormioGrid } from './FormioGrid';

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
      container: ({ title, params }) => {
        return (
          <div className="form-container">
            <h2>{title}</h2>
            <ul className="nav nav-tabs">
              <li role="presentation">
                <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id']}>View</Link>
              </li>
              <li role="presentation">
                <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id'] + '/edit'}>Edit</Link>
              </li>
              <li role="presentation">
                <Link to={this.base + '/' + this.name + '/' + params[this.name + 'Id'] + '/delete'}>Delete</Link>
              </li>
            </ul>
            <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id'} exactly component={this.getView()} />
            <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id' + '/edit'} exactly component={this.getEdit()} />
            <Match pattern={this.base + '/' + this.name + '/:' + this.name + 'Id' + '/delete'} exactly component={this.getDelete()} />
          </div>
        );
      },
      mapStatetoProps: ({ formio }) => {
        return {
          title: formio[this.name].form.form.title
        };
      },
      mapDispatchToProps: () => {
        return {};
      }
    });
  };

  getIndex = () => {
    return this.connectComponent({
      container: ({ form, submissions, pagination, limit, isFetching, onSortChange, onPageChange, onButtonClick }) => {
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
        dispatch(FormActions.fetch(this.name));
        dispatch(SubmissionActions.index(this.name));
        return {
          onSortChange: () => {},
          onPageChange: (page) => {
            dispatch(SubmissionActions.index(this.name, page));
          },
          onButtonClick: (button, id) => {
            switch(button) {
              case 'row':
              case 'view':
                router.transitionTo(this.base + '/' + this.name + '/' + id);
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
        dispatch(FormActions.fetch(this.name));
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
      container: ({ src, form, submission }) => {
        if (form.isFetching || !form.form || submission.isFetching || !submission.submission) {
          return (
            <div className="form-view">
              Loading...
            </div>
          );
        }
        else {
          return (
            <div className="form-view">
              <Formio
                src={src}
                form={form.form}
                submission={submission.submission}
                readOnly={true}
              />
            </div>
          );
        }
      },
      mapStateToProps: ({ formio }, { params }) => {
        return {
          src: formio[this.name].form.src + '/submission/' + params[this.name + 'Id'],
          form: formio[this.name].form,
          submission: formio[this.name].submission,
        };
      },
      mapDispatchToProps: (dispatch, { params }, router) => {
        dispatch(FormActions.fetch(this.name));
        dispatch(SubmissionActions.fetch(this.name, params[this.name + 'Id']));
        return {};
      }
    });
  };

  getEdit = () => {
    return this.connectComponent({
      container: ({ src, form, submission, onFormSubmit }) => {
        if (form.isFetching || !form.form || submission.isFetching || !submission.submission) {
          return (
            <div className="form-view">
              Loading...
            </div>
          );
        }
        else {
          return (
            <div className="form-view">
              <Formio
                src={ src }
                form={ form.form }
                submission={ submission.submission }
              />
            </div>
          );
        }
      },
        mapStateToProps: ({ formio }, { params }) => {
          return {
            src: formio[this.name].form.src + '/submission/' + params[this.name + 'Id'],
            form: formio[this.name].form,
            submission: formio[this.name].submission,
          };
      },
      mapDispatchToProps: (dispatch, { params }, router) => {
        dispatch(FormActions.fetch(this.name));
        dispatch(SubmissionActions.fetch(this.name, params[this.name + 'Id']));
        return {
          onFormSubmit: (error, submission) => {

          }
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
        return <Connected { ...this.props }></Connected>;
      }
    }
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
