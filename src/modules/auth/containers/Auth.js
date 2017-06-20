import React, {Component} from 'react';
import {Link} from 'react-router';
import FormioView from '../../../FormioView';
import {default as LoginView} from './Login';
import {default as RegisterView} from './Register';

export default class AuthView extends FormioView {
  component = class Auth extends Component {
    render() {
      const {location, Login, Register} = this.props;
      const {config} = this.props.formio.auth;
      return (location.pathname === '/' + config.path) ?
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-5 col-md-offset-1">
                <Login />
              </div>
              <div className="col-lg-5 col-md-5">
                <Register />
              </div>
            </div>
          </div> :
          <div className="row">
            <div className="col-md-4 col-md-offset-4">
              <div className="panel panel-default">
                <div className="panel-heading" style={{paddingBottom: 0, borderBottom: 'none'}}>
                  <ul className="nav nav-tabs" style={{borderBottom: 'none'}}>
                    <li role="presentation"><Link to={'/' + config.path + '/login'}>Login</Link></li>
                    <li role="presentation"><Link to={'/' + config.path + '/register'}>Register</Link></li>
                  </ul>
                </div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-lg-12">
                      {this.props.children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>;
    }
  }

  mapStateToProps = () => {
    return {
      Login: this.formio.auth.config.Login || LoginView,
      Register: this.formio.auth.config.Register || RegisterView
    };
  }
}
