'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Email',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function(data, index) {
    index = index || 0;
    return(
      <input
        type={this.props.component.inputType}
        className="form-control"
        id={this.props.component.key}
        data-index={index}
        name={this.props.name}
        value={data}
        disabled={this.props.readOnly}
        placeholder={this.props.component.placeholder}
        mask={this.props.component.inputMask}
        onChange={this.setValue}
        >
      </input>
    );
  }
});
