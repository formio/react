'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var selectMixin = require('./mixins/selectMixin');

var debounce = function (func, threshold, execAsap) {
  var timeout;
  return function debounced () {
    var obj = this, args = arguments;
    function delayed () {
      if (!execAsap)
        func.apply(obj, args);
      timeout = null;
    };
    if (timeout)
      clearTimeout(timeout);
    else if (execAsap)
      func.apply(obj, args);

    timeout = setTimeout(delayed, threshold || 100);
  };
};

module.exports = React.createClass({
  displayName: 'Address',
  mixins: [componentMixin, selectMixin],
  getTextField: function() {
    return 'formatted_address';
  },
  getValueField: function() {
    return null;
  },
  doSearch: debounce(function(text) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + text + '&sensor=false')
      .then(function(response) {
        response.json().then(function(data) {
          this.setState({
            selectItems: data.results
          });
        }.bind(this));
      }.bind(this));
  }, 200)
});