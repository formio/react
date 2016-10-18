import React from 'react';
import { Redirect } from 'react-router';
import { Formio } from '../../components';
import { FormioView } from '../../providers';
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

    init = (store) => {
      const { formio } = store.getState();
      if (!formio.currentUser.init) {
        store.dispatch(UserActions.fetch());
      }
    }

    mapStateToProps = (state, { location }) => {
      const { currentUser } = state.formio;
      console.log()
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

    mapDispatchToProps = () => {return {};}
  };
}
