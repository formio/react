'use strict'

var React = require('react');
var SignaturePad = require('react-signature-pad');

module.exports = React.createClass({
  displayName: 'Signature',
  render: function() {
    return(
      <div>
        <SignaturePad
          clearButton="true"
          {...this.props.component}
          />
      </div>
    );
  }
});