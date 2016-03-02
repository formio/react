'use strict'

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Fieldset',
  render: function() {
    var legend = (this.props.component.legend ? React.createElement("legend", null, this.props.component.legend) : '');
    return(
      React.createElement("fieldset", null, 
        legend, 
        this.props.component.components.map(function(component) {
          var value = (this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '');
          return (
            React.createElement(FormioComponent, React.__spread({}, 
              this.props, 
              {key: component.key, 
              name: component.key, 
              component: component, 
              value: value})
              )
          );
        }.bind(this))
        
      )
    );
  }
});