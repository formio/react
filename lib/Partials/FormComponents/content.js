'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'Content',
  render: function render() {
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: this.props.component.html } });
  }
});