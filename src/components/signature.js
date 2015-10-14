'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var SignaturePad = require('react-signature-pad');

module.exports = React.createClass({
  displayName: 'Signature',
  mixins: [componentMixin],
  getElements: function() {
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