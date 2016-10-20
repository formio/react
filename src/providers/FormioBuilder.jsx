import React from 'react';
import { Match } from 'react-router';
import { combineReducers } from 'redux';
import { formReducer, formsReducer, submissionReducer, submissionsReducer } from '../reducers';
import { addReducer, addRoute } from '../factories';
import { Index, Create, Form, View, Edit, Delete, SubmissionIndex, ActionsIndex, Access } from '../views/builder';

export default class {
  constructor(name, appUrl, options = {}) {
    this.name = name;
    this.key = name || 'forms';
    this.appUrl = appUrl;
    this.options = options;
    this.options.tag = this.options.tag || 'common';
    this.options.base = this.options.base || name ? '/' + name : '';

    addReducer(this.key, this.getReducers(this.key, this.appUrl));
    addRoute(this.getRoutes());
  }

  Index = Index

  Create = Create

  Form = Form

  View = View

  Edit = Edit

  Delete = Delete

  SubmissionIndex = SubmissionIndex

  ActionsIndex = ActionsIndex

  Access = Access

  getReducers(name, src) {
    return combineReducers({
      form: formReducer(name, src),
      forms: formsReducer(name, src),
      submission: submissionReducer(name, src),
      submissions: submissionsReducer(name, src)
    })
  }

  getRoutes() {
    return (
      <div className="formio-builder">
        <Match pattern={ this.options.base + '/forms'} exactly component={this.Index(this)} />
        <Match pattern={ this.options.base + '/forms/create'} exactly component={this.Create(this)} />
        <Match pattern={ this.options.base + '/form/:' + this.key + 'Id'} component={this.Form(this)} />
        <Match pattern={ this.options.base + '/form/:' + this.key + 'Id'} exactly component={this.View(this)} />
        <Match pattern={ this.options.base + '/form/:' + this.key + 'Id/edit'} exactly component={this.Edit(this)} />
        <Match pattern={ this.options.base + '/form/:' + this.key + 'Id/delete'} exactly component={this.Delete(this)} />
        <Match pattern={ this.options.base + '/form/:' + this.key + 'Id/submission'} exactly component={this.SubmissionIndex(this)} />
        <Match pattern={ this.options.base + '/form/:' + this.key + 'Id/actions'} exactly component={this.ActionsIndex(this)} />
        <Match pattern={ this.options.base + '/form/:' + this.key + 'Id/access'} exactly component={this.Access(this)} />
      </div>
    );
  }
}