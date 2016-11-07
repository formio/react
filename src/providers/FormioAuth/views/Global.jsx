import React from 'react';
import ReduxView from 'redux-view';
import { Redirect } from 'react-router';
import { UserActions } from '../actions';

export default function (authSettings) {
  return class extends ReduxView {
    container = ({ shouldRedirect, to }) => {
      if (shouldRedirect) {
        return <Redirect to={to} />
      }
      else {
        return null;
      }
    }

    initialize = (store) => {
      const init = store.getState().get('formio').get('auth').get('init');
      if (!init) {
        store.dispatch(UserActions.fetch());
      }
    }

    mapStateToProps = (state, { location }) => {
      const auth = state.get('formio').get('auth');
      console.log(auth, authSettings);
      return {
        shouldRedirect:
          authSettings.forceAuth &&
          authSettings.allowedStates.length &&
          auth.init &&
          !auth.isFetching &&
          !auth.user &&
          !authSettings.allowedStates.includes(location.pathname),
        to: authSettings.anonState
      }
    }
  };
}
