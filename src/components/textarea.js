'use strict'

var React = require('react');

module.exports = React.createClass({
  displayName: 'Textarea',
  render: function() {
    return(
      <textarea
        className="form-control"
        placeholder={this.props.component.placeholder }
      >
      </textarea>
    );
  }
});