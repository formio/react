import React from 'react';
import ReduxView from 'redux-view';
import { AlertActions } from '../../actions';

export default function (alerts) {
  return class extends ReduxView {
    container = ({ alerts }) => {
      if (!alerts) {
        return null;
      }
      return (
        <div className="formio-alerts">
          {
            alerts.map((alert, index) => {
              return (
                <div key={index} className={"alert alert-" + alert.type} role="alert">
                  {alert.message}
                </div>
              );
            })
          }
        </div>
      );
    }

    terminate = ({ dispatch, getState }) => {
      const { formio } = getState();
      if (formio.alerts && formio.alerts.alerts.length) {
        dispatch(AlertActions.reset());
      }
    }

    mapStateToProps = ({ formio }) => {
      return {
        alerts: formio.alerts.alerts
      };
    }

    mapDispatchToProps = null
  };
}
