import React from 'react';
import { Match, Link } from 'react-router';
import { combineReducers } from 'redux';
import { Formio, FormioConfirm, FormioGrid } from '../components';
import FormioProvider from './FormioProvider';
import { FormActions, SubmissionActions } from '../actions';
import { formReducer, submissionReducer, submissionsReducer } from '../reducers';
import { addReducer, addRoute } from '../factories';

export default class extends FormioProvider {
  constructor(name, src, options = {}) {
    super(name, src, options);
    this.name = name;
    this.src = src;
    this.options = options;
    this.options.base = this.options.base || '';

    addReducer(name, this.getReducers(name, src));
    addRoute(this.getRoutes());
  }

  basePath = () => this.options.base + '/' + this.name;

  Container = () => {
    return this.connectView({
      container: ({ title, params }) => {
        return (
          <div className="form-container">
            <h2>{title}</h2>
            <ul className="nav nav-tabs">
              <li role="presentation">
                <Link to={this.basePath() + '/' + params[this.name + 'Id']}>View</Link>
              </li>
              <li role="presentation">
                <Link to={this.basePath() + '/' + params[this.name + 'Id'] + '/edit'}>Edit</Link>
              </li>
              <li role="presentation">
                <Link to={this.basePath() + '/' + params[this.name + 'Id'] + '/delete'}>Delete</Link>
              </li>
            </ul>
            <Match pattern={this.basePath() + '/:' + this.name + 'Id'} exactly component={this.View()} />
            <Match pattern={this.basePath() + '/:' + this.name + 'Id' + '/edit'} exactly component={this.Edit()} />
            <Match pattern={this.basePath() + '/:' + this.name + 'Id' + '/delete'} exactly component={this.Delete()} />
          </div>
        );
      },
      mapStateToProps: ({ formio }) => {
        return {
          title: formio[this.name].form.form.title
        };
      },
      mapDispatchToProps: (dispatch, { params }) => {
        dispatch(FormActions.fetch(this.name));
        dispatch(SubmissionActions.fetch(this.name, params[this.name + 'Id']));
        return {};
      }
    });
  };
  
  Index = () => {
    return this.connectView({
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
              <Link className="btn btn-success" to={this.basePath() + 'Create'}><i className="glyphicon glyphicon-plus" aria-hidden="true"></i> New {form.title}</Link>
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
                router.transitionTo(this.basePath() + '/' + id);
                break;
              case 'edit':
                router.transitionTo(this.basePath() + '/' + id + '/edit');
                break;
              case 'delete':
                router.transitionTo(this.basePath() + '/' + id + '/delete');
                break;
            }
          }
        };
      }
    });
  };

  Create = () => {
    return this.connectView({
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
            router.transitionTo(this.basePath() + '/' + submission._id);
          }
        };
      }
    });
  };

  View = () => {
    return this.connectView({
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
      mapDispatchToProps: () => { return {};}
    });
  };

  Edit = () => {
    return this.connectView({
      container: ({ src, form, submission, onFormSubmit, params }) => {
        if (form.isFetching || !form.form || submission.isFetching || !submission.submission || params[this.name + 'Id'] !== submission.submission._id) {
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
                onFormSubmit={ onFormSubmit }
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
        return {
          onFormSubmit: submission => {
            router.transitionTo(this.basePath() + '/' + submission._id);
          }
        };
      }
    });
  };

  Delete = () => {
    return this.connectView({
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
        return {
          onYes: () => {
            SubmissionActions.delete(this.name, params[this.name + 'Id'])
              .then(() => {
                router.transitionTo(this.basePath());
              })
              .catch((error) => {

              })
          },
          onNo: () => {
            router.transitionTo(this.basePath());
          }
        };
      }
    });
  };

  getRoutes = () => {
    return (
      <div className={this.name}>
        <Match pattern={this.basePath()} exactly component={this.Index()} />
        <Match pattern={this.basePath() + 'Create'} exactly component={this.Create()} />
        <Match pattern={this.basePath() + '/:' + this.name + 'Id'} component={this.Container()} />
      </div>
    );
  }

  getReducers = (name, src) => {
    return combineReducers({
      form: formReducer(name, src),
      submission: submissionReducer(name, src),
      submissions: submissionsReducer(name, src)
    })
  }
}
