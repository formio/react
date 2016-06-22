var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var selectMixin = require('./mixins/selectMixin');
var debounce = require('lodash/debounce');

module.exports = React.createClass({
  displayName: 'Address',
  mixins: [valueMixin, selectMixin],
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
