'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var selectMixin = require('./mixins/selectMixin');
var formiojs = require('formiojs');
var util = require('../util');
var get = require('lodash/get');
var debounce = require('lodash/debounce');

module.exports = React.createClass({
  options: {},
  lastInput: '',
  displayName: 'Select',
  mixins: [valueMixin, selectMixin],
  componentWillMount: function componentWillMount() {
    switch (this.props.component.dataSrc) {
      case 'values':
        this.internalFilter = true;
        this.setState({
          selectItems: this.props.component.data.values
        });
        break;
      case 'json':
        this.internalFilter = true;
        try {
          this.setState({
            selectItems: JSON.parse(this.props.component.data.json)
          });
        } catch (error) {
          this.setState({
            selectItems: []
          });
        }
        break;
      case 'resource':
      case 'url':
        if (this.props.component.dataSrc === 'url') {
          this.url = this.props.component.data.url;
          if (this.url.substr(0, 1) === '/') {
            this.url = formiojs.getBaseUrl() + this.props.component.data.url;
          }

          // Disable auth for outgoing requests.
          if (!this.props.component.authenticate && this.url.indexOf(formiojs.getBaseUrl()) === -1) {
            this.options = {
              disableJWT: true,
              headers: {
                Authorization: undefined,
                Pragma: undefined,
                'Cache-Control': undefined
              }
            };
          }
        } else {
          this.url = formiojs.getBaseUrl();
          if (this.props.component.data.project) {
            this.url += '/project/' + this.props.component.data.project;
          }
          this.url += '/form/' + this.props.component.data.resource + '/submission';
        }

        this.options.params = {
          limit: 100,
          skip: 0
        };

        this.refreshItems();

        break;
      default:
        this.setState({
          selectItems: []
        });
    }
  },
  refreshItems: debounce(function (input, newUrl, append) {
    newUrl = newUrl || this.url;
    // Allow templating the url.
    newUrl = util.interpolate(newUrl, {
      data: this.props.data,
      formioBase: formiojs.getBaseUrl()
    });
    if (!newUrl) {
      return;
    }

    // If this is a search, then add that to the filter.
    if (this.props.component.searchField && input) {
      // If they typed in a search, reset skip.
      if (this.lastInput !== input) {
        this.lastInput = input;
        this.options.params.skip = 0;
      }
      newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + encodeURIComponent(this.props.component.searchField) + '=' + encodeURIComponent(input);
    }

    // Add the other filter.
    if (this.props.component.filter) {
      var filter = util.interpolate(this.props.component.filter, { data: this.props.data });
      newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + filter;
    }

    // If they wish to return only some fields.
    if (this.props.component.selectFields) {
      this.options.params.select = this.props.component.selectFields;
    }

    // If this is a search, then add that to the filter.
    newUrl += (newUrl.indexOf('?') === -1 ? '?' : '&') + util.serialize(this.options.params);
    formiojs.request(newUrl).then(function (data) {
      // If the selectValue prop is defined, use it.
      if (this.props.component.selectValues) {
        this.setResult(get(data, this.props.component.selectValues, []), append);
      }
      // Attempt to default to the formio settings for a resource.
      else if (data.hasOwnProperty('data')) {
          this.setResult(data.data, append);
        } else if (data.hasOwnProperty('items')) {
          this.setResult(data.items, append);
        }
        // Use the data itself.
        else {
            this.setResult(data, append);
          }
    }.bind(this));
  }, 200),
  loadMoreItems: function loadMoreItems(event) {
    event.stopPropagation();
    event.preventDefault();
    this.options.params.skip += this.options.params.limit;
    this.refreshItems(null, null, true);
  },
  setResult: function setResult(data, append) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    this.setState(function (previousState) {
      if (append) {
        previousState.selectItems = previousState.selectItems.concat(data);
      } else {
        previousState.selectItems = data;
      }
      previousState.hasNextPage = previousState.selectItems.length >= this.options.params.limit + this.options.params.skip;
      return previousState;
    });
  }
});