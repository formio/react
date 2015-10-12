'use strict'

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Fieldset',
  render: function() {
    var legend = (this.props.component.legend ? <legend>{this.props.component.legend}</legend> : '');
    return(
      <fieldset>
        {legend}
        {this.props.component.components.map(function(component) {
          var value = (this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '');
          return (
            <FormioComponent
              {...this.props}
              key={component.key}
              name={component.key}
              component={component}
              value={value}
              />
          );
        }.bind(this))
        }
      </fieldset>
    );
  }
});