import React from 'react';
import { HashRouter, Match, Link, propTypes } from 'react-router';
import { connect } from 'react-redux';
import { FormActions, SubmissionActions } from './actions';
import { injectReducers, injectRoute } from './providers';
import { Formio } from './Formio';
import { FormioConfirm } from './FormioConfirm';
import { FormioGrid } from './FormioGrid';

export class FormioResource {
  constructor(name, src, options = {}) {
    this.name = name;
    this.src = src;
    this.options = options;
    this.options.base = this.options.base || '';

    injectReducers(name, src);
    injectRoute(this.getRoutes());
  }

  getPath = () => this.options.base + '/' + this.name;

  getContainer = () => {
    return this.connectComponent({
      container: ({ title, params }) => {
        return (
          <div className="form-container">
            <h2>{title}</h2>
            <ul className="nav nav-tabs">
              <li role="presentation">
                <Link to={this.getPath() + '/' + params[this.name + 'Id']}>View</Link>
              </li>
              <li role="presentation">
                <Link to={this.getPath() + '/' + params[this.name + 'Id'] + '/edit'}>Edit</Link>
              </li>
              <li role="presentation">
                <Link to={this.getPath() + '/' + params[this.name + 'Id'] + '/delete'}>Delete</Link>
              </li>
            </ul>
            <Match pattern={this.getPath() + '/:' + this.name + 'Id'} exactly component={this.getView()} />
            <Match pattern={this.getPath() + '/:' + this.name + 'Id' + '/edit'} exactly component={this.getEdit()} />
            <Match pattern={this.getPath() + '/:' + this.name + 'Id' + '/delete'} exactly component={this.getDelete()} />
          </div>
        );
      },
      mapStateToProps: ({ formio }) => {
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
              <h3>{form.title}s</h3>
              <Link className="btn btn-success" to={this.getPath() + 'Create'}><i className="glyphicon glyphicon-plus" aria-hidden="true"></i> New {form.title}</Link>
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
                router.transitionTo(this.getPath() + '/' + id);
                break;
              case 'edit':
                router.transitionTo(this.getPath() + '/' + id + '/edit');
                break;
              case 'delete':
                router.transitionTo(this.getPath() + '/' + id + '/delete');
                break;
            }
          }
        };
      }
    });
  };

  getCreate = () => {
    return this.connectComponent({
      container: ({ pageTitle, form, onFormSubmit }) => {
        let element = null;
        if (form.isFetching || !form.form) {
          element = 'Loading...';
        }
        else {
          element = <Formio src={form.src} form={form.form} onFormSubmit={onFormSubmit} />;
        }
        return (
          <div className="form-create">
            <h3>{pageTitle}</h3>
            { element }
          </div>
        );
      },
      mapStateToProps: ({formio}) => {
        return {
          form: formio[this.name].form,
          pageTitle: 'New ' + (formio[this.name].form.form.title || '')
        };
      },
      mapDispatchToProps: (dispatch, ownProps, router) => {
        dispatch(FormActions.fetch(this.name));
        return {
          onFormSubmit: submission => {
            router.transitionTo(this.getPath() + '/' + submission._id);
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
            router.transitionTo(this.getPath() + '/' + submission._id);
          }
        };
      }
    });
  };

  getDelete = () => {
    return this.connectComponent({
      container: ({ title, onYes, onNo }) => {
        return (
          <div className="form-delete">
            <FormioConfirm
              message={'Are you sure you wish to delete the ' + title + '?'}
              buttons={[
                {
                  text: 'Yes',
                  class: 'btn btn-danger',
                  callback: onYes
                },
                {
                  text: 'No',
                  class: 'btn btn-default',
                  callback: onNo
                }
              ]}
            />
          </div>
        );
      },
      mapStateToProps: ({ formio }) => {
        return {
          title: formio[this.name].form.form.title
        };
      },
      mapDispatchToProps: (dispatch, { params }, router) => {
        dispatch(FormActions.fetch(this.name));
        dispatch(SubmissionActions.fetch(this.name, params[this.name + 'Id']));
        return {
          onYes: () => {
            console.log('yes');
          },
          onNo: () => {
            console.log('no');
          }
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
        <Match pattern={this.getPath()} exactly component={this.getIndex()} />
        <Match pattern={this.getPath() + 'Create'} exactly component={this.getCreate()} />
        <Match pattern={this.getPath() + '/:' + this.name + 'Id'} component={this.getContainer()} />
      </div>
    );
  }
}
