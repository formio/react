import React from 'react';
import { Match, Link, Redirect } from 'react-router';
import FormioProvider from './FormioProvider';
import { Formio } from '../components';
import { UserActions } from '../actions';
import { addReducer, addRoute } from '../factories';
import { userReducer } from '../reducers';
import { Auth, Global, Logout } from '../views/auth';

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

    addReducer('currentUser', this.getReducers());
    addRoute(this.getRoutes());
  }

  /**
   * This is a crazy workaround to force any state transitions to either be authenticated or in allowedStates.
   *
   * @returns {{contextTypes, new(*=, *=): {render}}}
   * @constructor
   */
  Global = Global

  Logout = Logout

  Auth = Auth

  getReducers() {
    return userReducer();
  }

  getRoutes() {
    return (
      <div className="formio-auth">
        <Match pattern="/" component={this.Global(this)} />
        <Match pattern="/logout" exactly component={this.Logout(this)} />
        <Match pattern={this.anonState} exactly component={this.Auth(this)} />
      </div>
    );
  }
}