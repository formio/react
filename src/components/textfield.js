'use strict'

var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Textfield',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function(data) {
    return(
      <input
        type={this.props.component.inputType}
        className="form-control"
        id={this.props.component.key}
        name={this.props.name}
        value={data}
        disabled={this.props.readOnly}
        placeholder={this.props.component.placeholder}
        formio-input-mask={this.props.component.inputMask}
        onChange={this.setValue}
        >
      </input>
    );
  }
});