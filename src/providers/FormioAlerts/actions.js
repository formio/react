export const ALERT_ADD = 'ALERT_ADD';
function addAlert(alert) {
  return {
    type: ALERT_ADD,
    alert
  };
}

export const ALERT_RESET = 'ALERT_RESET';
function resetAlerts() {
  return {
    type: ALERT_RESET
  };
}

export const AlertActions = {
  add: (alert) => {
    return addAlert(alert);
  },
  reset: () => {
    return resetAlerts();
  }
};
