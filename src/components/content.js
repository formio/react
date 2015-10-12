'use strict'

var React = require('react');

module.exports = React.createClass({
  displayName: 'Content',
  render: function() {
    return(<div dangerouslySetInnerHTML={{__html: this.props.component.html}}></div>);
  }
});