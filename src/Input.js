'use strict'

var React = require('react');
var ReactMaskMixin = require('react-mask-mixin');

module.exports = React.createClass({
  displayName: 'Input',
  mixins: [ReactMaskMixin],
  render: function() {
    return(<input {...this.props} {...this.mask.props}/>);
  }
});