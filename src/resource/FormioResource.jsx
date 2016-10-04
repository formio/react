import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {connect} from 'react-redux';
import {fetchForm, fetchSubmission, fetchSubmissions} from '../actions';
import {injectReducers} from '../reducers';

class FormioResource {
  constructor(name, src, store, history) {
    this.name = name;
    this.src = src;
    this.store = store;
    this.history = history;

    injectReducers(name, src);
  }

  connectView(view, state, next) {
    next(null, connect(
      options[view].mapStateToProps,
      options[view].mapDispatchToProps
    )(options[view].container));
  }

  getRoutes() {

  }
}

export {FormioResource};