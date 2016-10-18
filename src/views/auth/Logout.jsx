import React from 'react';
import { Redirect } from 'react-router';
import { FormioView } from '../../components';
import { UserActions } from '../../actions';

export default function (resource) {
  return class extends FormioView {
    container = Redirect

    init = ({ dispatch }) => {
      dispatch(UserActions.logout());
    }

    mapStateToProps = () => {
      return {
        to: resource.anonState
      }
    }

    mapDispatchToProps = () => {return {};}
  };
}
