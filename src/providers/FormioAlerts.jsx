import React from 'react';
import { Match } from 'react-router';
import { addReducer, addRoute } from '../factories';
import { alertsReducer } from '../reducers';
import { Alerts } from '../views/alerts';

export default class {
  constructor({
    appUrl,
    loginForm = 'user/login',
    registerForm = 'user/register',
    forceAuth = false,
    authState = '/',
    anonState = '/auth',
    allowedStates = ['/auth']
  }) {
    this.appUrl = appUrl;
    this.loginForm = loginForm;
    this.registerForm = registerForm;
    this.forceAuth = forceAuth;
    this.authState = authState;
    this.anonState = anonState;
    this.allowedStates = !forceAuth || allowedStates;

    addReducer('alerts', this.getReducers());
    addRoute(this.getRoutes());
  }

  Alerts = Alerts

  getReducers() {
    return alertsReducer();
  }

  getRoutes() {
    var Alerts = this.Alerts(this);
    return (
      <div className="formio-alerts">
        <Match pattern="/" component={this.Alerts(this)} />
      </div>
    );
  }
}