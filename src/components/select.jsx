var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var selectMixin = require('./mixins/selectMixin');
var formiojs = require('formiojs');
var util = require('../util');
var debounce = require('lodash/debounce');

module.exports = React.createClass({
  displayName: 'Select',
  mixins: [valueMixin, selectMixin],
  componentWillMount: function() {
    switch (this.props.component.dataSrc) {
      case 'values':
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        try {
          this.setState({
            selectItems: JSON.parse(this.props.component.data.json)
          });
        }
        catch (error) {
          this.setState({
            selectItems: []
          });
        }
        break;
      case 'resource':
        this.url = formiojs.getBaseUrl() + '/project/' + this.props.component.data.project + '/form/'  + this.props.component.data.resource + '/submission';
        /* eslint-disable no-fallthrough */
      case 'url':
        this.url = this.url || this.props.component.data.url;
        var options = {cache: true};
        if (this.url.substr(0, 1) === '/') {
          this.url = formiojs.getBaseUrl() + this.url;
        }

        // Allow templating the url.
        this.url = util.interpolate(this.url, {
          data: this.props.data,
          formioBase: formiojs.getBaseUrl()
        });

        // Add the other filter.
        if (this.props.component.filter) {
          var filter = util.interpolate(this.props.component.filter, {data: this.props.value});
          this.url += ((this.url.indexOf('?') === -1) ? '?' : '&') + filter;
        }
        this.refreshData(this.url);
        // Disable auth for outgoing requests.
        // TODO: Make this work with formiojs.request or switch to Fetch()
        //if (this.props.component.data.url.indexOf(Formio.getBaseUrl()) === -1) {
        //  options = {
        //    disableJWT: true,
        //    headers: {
        //      Authorization: undefined,
        //      Pragma: undefined,
        //      'Cache-Control': undefined
        //    }
        //  };
        //}
        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  },
  refreshData: function(url) {
    // If this is a search, then add that to the filter.
    formiojs.request(url).then(function(data) {
      this.setState({
        selectItems: data
      });
    }.bind(this));
  },
  doSearch: debounce(function(text) {
    var url = this.url;
    if (this.props.component.searchField) {
      url += ((this.url.indexOf('?') === -1) ? '?' : '&') +
        encodeURIComponent(this.props.component.searchField) +
        '__regex=' +
        encodeURIComponent(text);
    }
    this.refreshData(url);
  }, 200)
});
