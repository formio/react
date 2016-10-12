import React from 'react';

export class FormioAlerts extends React.Component {
  constructor = (props) => {
    this.state = {
      alerts: this.getAlerts()
    };
  };

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