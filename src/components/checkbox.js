'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Checkbox',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function(value, index) {
    index = index || 0;
    var required = (this.props.component.validate.required ? 'field-required' : '');
    return(
      <div className="checkbox">
        <label htmlFor={this.props.component.key} className={required}>
          <input
            type="checkbox"
            id={this.props.component.key}
            data-index={index}
            name={this.props.name}
            value={value}
            disabled={this.props.readOnly}
            onChange={this.setValue}
          />{this.props.component.label}
        </label>
      </div>
    );
  }
});