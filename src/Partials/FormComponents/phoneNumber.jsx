var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var multiMixin = require('./mixins/multiMixin');
var inputMixin = require('./mixins/inputMixin');

module.exports = React.createClass({
  displayName: 'PhoneNumber',
  mixins: [valueMixin, multiMixin, inputMixin]
});
