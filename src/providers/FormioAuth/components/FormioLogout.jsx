import React from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../actions';

export class FormioLogout extends React.Component {
  static propTypes = {
    onLogout: React.PropTypes.func
  };

  render() {
    const Logout = connect(
      (state) => {
        if (state.formio && state.formio.auth) {
          return {
            auth: state.formio.auth.user
          };
        }
        else {
          return {
            auth: false
          };
        }
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