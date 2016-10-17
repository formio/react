import React from 'react';
import { Match, Link, Redirect } from 'react-router';
import FormioProvider from './FormioProvider';
import { Formio } from '../components';
import { UserActions } from '../actions';
import { addReducer, addRoute } from '../factories';
import { userReducer } from '../reducers';

export default class extends FormioProvider {
  constructor({
    appUrl,
    loginForm = 'user/login',
    registerForm = 'user/register',
    forceAuth = false,
    authState = '/',
    anonState = '/auth',
    allowedStates = ['/auth']
  }) {
    super();

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
  Global = () => {
    return this.connectComponent({
      container: class extends React.Component {
        render = () => {
          const { shouldRedirect, to } = this.props;
          if (shouldRedirect) {
            return <Redirect to={to} />
          }
          else {
            return null;
          }
        }
      },
      mapStateToProps: (state, { location }) => {
        const { currentUser } = state.formio;
        return {
          shouldRedirect:
            this.forceAuth &&
            this.allowedStates.length &&
            currentUser.init && !currentUser.isFetching && !currentUser.user && !this.allowedStates.includes(location.pathname),
          to: this.anonState
        }
      },
      mapDispatchToProps: () => { return {};}
    })
  }

  Logout = () => {
    return this.connectComponent({
      container: Redirect,
      mapStateToProps: () => {
        return {
          to: this.anonState
        }
      },
      mapDispatchToProps: (dispatch) => {
        dispatch(UserActions.logout());
        return {};
      }
    });
  }

  Auth = () => {
    return this.connectComponent({
      container: ({ onFormSubmit }) => {
        let loginForm = null;
        let registerForm = null;
        if (this.loginForm) {
          loginForm = (
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Login</h3>
              </div>
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-12">
                    <Formio src={this.appUrl + '/' + this.loginForm} onFormSubmit={onFormSubmit}></Formio>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        if (this.registerForm) {
          registerForm = (
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Register</h3>
              </div>
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-12">
                    <Formio src={this.appUrl + '/' + this.registerForm} onFormSubmit={onFormSubmit}></Formio>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (loginForm && registerForm) {
          loginForm = (
            <div className="col-md-6">
              {loginForm}
            </div>
          );
          registerForm = (
            <div className="col-md-6">
              {registerForm}
            </div>
          );
        }
        else {
          if (loginForm) {
            loginForm = (
              <div className="col-md-8 col-md-offset-2">
                {loginForm}
              </div>
            );
          }
          if (registerForm) {
            registerForm = (
              <div className="col-md-8 col-md-offset-2">
                {registerForm}
              </div>
            );
          }
        }

        return (
          <div className="formio-auth">
            {loginForm}
            {registerForm}
          </div>
        );
      },
      mapStateToProps: null,
      mapDispatchToProps: (dispatch, ownProps, router) => {
        return {
          onFormSubmit: () => {
            dispatch(UserActions.fetch());
            router.transitionTo(this.authState);
          }
        };
      }
    });
  }

  getReducers() {
    return userReducer();
  }

  getRoutes() {
    return (
      <div className="formio-auth">
        <Match pattern="/" component={this.Global()} />
        <Match pattern="/logout" exactly component={this.Logout()} />
        <Match pattern={this.anonState} exactly component={this.Auth()} />
      </div>
    );
  }
}