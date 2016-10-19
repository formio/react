import React from 'react';
import { Redirect } from 'react-router';
import { FormioView } from '../../components';
import { UserActions } from '../../actions';

export default function (auth) {
  return class extends FormioView {
    container = ({ shouldRedirect, to }) => {
      if (shouldRedirect) {
        return <Redirect to={to} />
      }
      else {
        return null;
      }
    }

    initialize = (store) => {
      const { formio } = store.getState();
      if (!formio.currentUser.init) {
        store.dispatch(UserActions.fetch());
      }
    }

    mapStateToProps = (state, { location }) => {
      const { currentUser } = state.formio;
      return {
        shouldRedirect:
          auth.forceAuth &&
          auth.allowedStates.length &&
          currentUser.init &&
          !currentUser.isFetching &&
          !currentUser.user &&
          !auth.allowedStates.includes(location.pathname),
        to: auth.anonState
      }
    }

    mapDispatchToProps = null
  };
}
