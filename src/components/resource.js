'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var selectMixin = require('./mixins/selectMixin');
var formiojs = require('formiojs');

module.exports = React.createClass({
  displayName: 'Resource',
  mixins: [componentMixin, selectMixin],
  doSearch: function(text) {

  }
});