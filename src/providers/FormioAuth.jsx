import React from 'react';
import { Match } from 'react-router';
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
   * Global is used to enforce "forceAuth" and will redirect if not logged in.
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