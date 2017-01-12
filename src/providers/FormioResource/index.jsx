import React from 'react';
import { Match } from 'react-router';
import { injectReducer } from 'redux-injector';
import { combineReducers } from 'redux';
import { formReducer, submissionReducer, submissionsReducer } from '../Formio/reducers';
import { addReducer, addRoute } from '../../factories';
import { Index, Create, Container, View, Edit, Delete } from './views';

export class FormioResource {
  constructor(name, src, options = {}) {
    this.name = name;
    this.src = src;
    this.options = options;
    this.options.base = this.options.base || '';

    const reducer = this.getReducers(name, src);
    injectReducer(['formio', name], reducer);
    addReducer(name, reducer);
    addRoute(this.getRoutes());
  }

  basePath = () => this.options.base + '/' + this.name;

  Container = Container;

  Index = Index

  Create = Create

  View = View

  Edit = Edit

  Delete = Delete

  getRoutes = () => {
    return (
      <div className={this.name}>
        <Match pattern={this.basePath()} exactly component={this.Index(this)} />
        <Match pattern={this.basePath() + 'Create'} exactly component={this.Create(this)} />
        <Match pattern={this.basePath() + '/:' + this.name + 'Id'} component={this.Container(this)} />
        <Match pattern={this.basePath() + '/:' + this.name + 'Id'} exactly component={this.View(this)} />
        <Match pattern={this.basePath() + '/:' + this.name + 'Id' + '/edit'} exactly component={this.Edit(this)} />
        <Match pattern={this.basePath() + '/:' + this.name + 'Id' + '/delete'} exactly component={this.Delete(this)} />
      </div>
    );
  }

  getReducers = (name, src) => {
    return combineReducers({
      form: formReducer(name, src),
      submission: submissionReducer(name, src),
      submissions: submissionsReducer(name, src)
    });
  }
}
