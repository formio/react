'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var selectMixin = require('./mixins/selectMixin');
var Formiojs = require('formiojs');

module.exports = React.createClass({
  displayName: 'Resource',
  mixins: [valueMixin, selectMixin],
  componentWillMount: function componentWillMount() {
    this.formio = new Formiojs(Formiojs.getBaseUrl() + '/project/' + this.props.component.project + '/form/' + this.props.component.resource);
    this.refreshItems();
  },
  getValueField: function getValueField() {
    // This will cause the whole object to be returned.
    return false;
  },
  refreshItems: function refreshItems(text) {
    var settings = this.props.component;
    if (settings.resource) {
      var params = {
        limit: 9999
      };

      // If they wish to filter the results.
      if (settings.selectFields) {
        params.select = settings.selectFields;
      }

      if (settings.searchFields && Array.isArray(settings.searchFields) && text) {
        settings.searchFields.forEach(function (field) {
          params[field] = text;
        });
      }

      // Load the submissions.
      this.formio.loadSubmissions({
        params: params
      }).then(function (submissions) {
        this.setState({
          selectItems: submissions
        });
      }.bind(this));
    }
  }
});