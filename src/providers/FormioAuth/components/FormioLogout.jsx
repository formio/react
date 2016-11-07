import React from 'react';
import { propTypes } from 'react-router';
import { connect } from 'react-redux';
import { UserActions } from '../actions';

export class FormioLogout extends React.Component {
  static propTypes = {
    onLogout: React.PropTypes.func
  };

  static contextTypes = {
    router: propTypes.routerContext
  };

  render() {
    const Logout = connect(
      (state) => {
        return {
          auth: state.get('formio').get('auth').get('user') || false
        };
      },
      ((dispatch) => {
        return {
          onClick: () => {
            dispatch(UserActions.logout());
            if (typeof this.props.onLogout === 'function') {
              this.props.onLogout(dispatch);
            }
          }
        };
      })
    )(
      ({ user, onClick }) => {
        if (!user) {
          return null;
        }
        else {
          return <a onClick={() => {onClick()}}>{this.props.children}</a>
        }
      }
    );
    return <Logout>{this.props.children}</Logout>;
  }
}