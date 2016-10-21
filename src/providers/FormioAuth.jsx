import React from 'react';
import { Match } from 'react-router';
import { addReducer, addRoute } from '../factories';
import { authReducer } from '../reducers';
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

    addReducer('auth', this.getReducers(this.appUrl));
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

  getReducers(appUrl) {
    return authReducer(appUrl);
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