import React from 'react';
import ReduxView from 'redux-view';
import { Redirect } from 'react-router';
import { UserActions } from '../actions';

export default function (resource) {
  return class extends ReduxView {
    container = Redirect

    initialize = ({ dispatch }) => {
      dispatch(UserActions.logout());
    }

    mapStateToProps = () => {
      return {
        to: resource.anonState
      }
    }

    mapDispatchToProps = null
  };
}
