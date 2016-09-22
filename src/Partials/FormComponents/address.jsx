import React from 'react';
import valueMixin from './mixins/valueMixin';
import selectMixin from './mixins/selectMixin';
import debounce from 'lodash/debounce';

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
