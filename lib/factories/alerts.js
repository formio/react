'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alerts = alerts;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var alerts = [];

function alerts() {
  var _this = this;

  addAlert = function addAlert(alert) {
    alerts.push(alert);
  };

  getAlerts = function getAlerts() {
    var tempAlerts = [].concat(_toConsumableArray(alerts));
    alerts.length = 0;
    exports.alerts = alerts = [];
    return tempAlerts;
  };

  onError = function onError(error) {
    if (error.message) {
      _this.addAlert({
        type: 'danger',
        message: error.message,
        element: error.path
      });
    } else {
      var errors = error.hasOwnProperty('errors') ? error.errors : error.data.errors;
      [].concat(_toConsumableArray(errors)).forEach(_this.onError);
    }
  };
}