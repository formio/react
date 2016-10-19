'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ALERT_ADD = exports.ALERT_ADD = 'ALERT_ADD';
function addAlert(alert) {
  return {
    type: ALERT_ADD,
    alert: alert
  };
}

var ALERT_RESET = exports.ALERT_RESET = 'ALERT_RESET';
function resetAlerts() {
  return {
    type: ALERT_RESET
  };
}

var AlertActions = exports.AlertActions = {
  add: function add(alert) {
    return addAlert(alert);
  },
  reset: function reset() {
    return resetAlerts();
  }
};