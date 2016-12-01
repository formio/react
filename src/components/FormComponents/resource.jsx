import React from 'react';
import valueMixin from './mixins/valueMixin';
import selectMixin from './mixins/selectMixin';
import componentMixin from './mixins/componentMixin';
import { raw, interpolate } from '../../util';
import Formiojs from 'formiojs';

module.exports = React.createClass({
  displayName: 'Resource',
  mixins: [valueMixin, selectMixin, componentMixin],
  componentWillMount: function() {
    this.formio = new Formiojs(Formiojs.getBaseUrl() + '/project/' + this.props.component.project + '/form/' + this.props.component.resource);
    this.refreshItems();
  },
  getValueField: function() {
    // This will cause the whole object to be returned.
    return false;
  },
  refreshItems: function(text) {
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
        settings.searchFields.forEach(function(field) {
          params[field] = text;
        });
      }

      // Load the submissions.
      this.formio.loadSubmissions({
        params: params
      }).then(function(submissions) {
        this.setState({
          selectItems: submissions
        });
      }.bind(this));
    }
  },
  getValueDisplay: function(component, data) {
    return React.createElement('span', raw(interpolate(component.template, {item: data})));
  }
});
