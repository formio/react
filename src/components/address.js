'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var selectMixin = require('./mixins/selectMixin');

module.exports = React.createClass({
  displayName: 'Address',
  mixins: [componentMixin, selectMixin],
  getTextField: function() {
    return 'formatted_address';
  },
  getValueField: function() {
    return null;
  },
  doSearch: function(text) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + text + '&sensor=false')
      .then(function(response) {
        response.json().then(function(data) {
          this.setState({
            selectItems: data.results
          });
        }.bind(this));
      }.bind(this));
  }
});