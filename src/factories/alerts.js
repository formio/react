let alerts = [];

export function alerts() {
  addAlert = alert => {
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
}