import React from 'react';
import { default as storeShape } from 'react-redux/lib/utils/storeShape';
import isEqual from 'lodash/isEqual';

export class Has extends React.Component {
  static contextTypes = {
    store: storeShape
  }

  constructor(props, context) {
    super(props, context);

    this.store = context.store;
    this.state = {
      auth: this.store.getState().formio.auth || false
    };
  }

  componentWillMount = () => {
    // Only subscribe if auth is set.
    if (this.state.auth) {
      this.unsubscribe = this.store.subscribe(this.handleChange);
    }
  }

  componentWillUnMount = () => {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  handleChange = () => {
    const newUser = this.store.getState().formio.auth || false;
    if (!isEqual(this.state.auth, newUser)) {
      this.setState({
        auth: newUser
      });
    }
  }

  hasAccess = () => {
    const { to, permission, type = 'submissionAccess' } = this.props;
    const { auth } = this.state;

    // If not checking permission access.
    if (!to || !permissions) {
      return false;
    }

    // If access hasn't been initialized yet, don't allow access.
    if (!auth[type] || !auth[type][to]) {
      return false;
    }

    let permissions = permission;
    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    let hasAccess = false;
    permissions.forEach(function(permission) {
      // Check that there are permissions.
      if (!auth[type][to][permission]) {
        return false;
      }
      // Check for anonymous users.
      if (!auth.user) {
        if (auth[type][to][permission].indexOf(auth.roles.anonymous._id) !== -1) {
          hasAccess = true;
        }
      }
      else {
        // Check the user's roles for access.
        auth.user.roles.forEach(function(role) {
          if (user[type][to][permission].indexOf(role) !== -1) {
            hasAccess = true;
          }
        });
      }
    });
    return hasAccess;
  }

  hasRole = () => {
    const { role } = this.props;
    const { auth } = this.state;

    // If not using role check.
    if (!role) {
      return false;
    }

    // Ensure roles is an array.
    let roles = role;
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    // Lowercase all the names.
    roles = roles.map(role => role.toLowerCase());

    // Check for anonymous users differently.
    if (!auth.user) {
      return roles.indexOf('anonymous') !== -1;
    }

    let hasRole = false;
    roles.forEach(role => {
      if (auth.roles[role] && auth.user.roles.indexOf(auth.roles[role]._id) !== -1) {
        hasRole = true;
      }
    });
    return hasRole;
  }

  render = () => {
    const { children } = this.props;
    const { auth } = this.state;

    // If auth but no access, return nothing.
    if (!!auth && !this.hasAccess() && !this.hasRole()) {
      return null;
    }
    return children;
  }
}