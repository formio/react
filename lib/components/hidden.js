'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');

module.exports = React.createClass({
  mixins: [valueMixin],
  displayName: 'Hidden',
  getElements: function getElements() {
    var value = this.state && this.state.hasOwnProperty('value') ? this.state.value : '';
    return React.createElement('input', { type: 'hidden', id: this.props.component.key, name: this.props.component.key, value: value });
  }
});