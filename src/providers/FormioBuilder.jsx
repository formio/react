import React from 'react';
import { Match } from 'react-router';
import { addReducer, addRoute } from '../factories';
import { Index } from '../views/builder';

export default class {
  constructor(name, src, options = {}) {
    this.name = name;
    this.src = src;
    this.options = options;
    this.options.tag = this.options.tag || 'common';
    this.options.base = this.options.base || name ? '/' + name : '';

    //addReducer('currentUser', this.getReducers());
    addRoute(this.getRoutes());
  }

  /**
   * Global is used to enforce "forceAuth" and will redirect if not logged in.
   *
   * @returns {{contextTypes, new(*=, *=): {render}}}
   * @constructor
   */
  Index = Index

  getReducers() {
    return userReducer();
  }

  getRoutes() {
    return (
      <div className="formio-builder">
        <Match pattern={ this.options.base + '/forms'} component={this.Index(this)} />
      </div>
    );
  }
}