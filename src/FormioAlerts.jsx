import React from 'react';

let alerts = [];

export class FormioAlerts extends React.Component {
  constructor = (props) => {
    this.state = {
      alerts: this.getAlerts()
    };
  };

  static addAlert = alert => {
    alerts.push(alert);
  };

  getAlerts = () => {
    const tempAlerts = [...alerts];
    alerts.length = 0;
    alerts = [];
    return tempAlerts;
  };

  onError = (error) => {
    if (error.message) {
      this.addAlert({
        type: 'danger',
        message: error.message,
        element: error.path
      });
    }
    else {
      const errors = error.hasOwnProperty('errors') ? error.errors : error.data.errors;
      [...errors].forEach(this.onError);
    }
  }

  render = () => {
    const { alerts } = this.state;
    return (
      <div className="formio-alerts">
        {
          alerts.map(alert => {
            return (
              <div className={"alert alert-" + alert.type} role="alert">
                {alert.message}
              </div>
            );
          })
        }
      </div>
    );
  }
}