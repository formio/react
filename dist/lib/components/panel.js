'use strict'

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Panel',
  render: function() {
    var title = (this.props.component.title ? React.createElement("div", {className: "panel-heading"}, React.createElement("h3", {className: "panel-title"}, this.props.component.title)) : '');
    var className = "panel panel-" + this.props.component.theme;
    return(
      React.createElement("div", {className: className}, 
        title, 
        React.createElement("div", {className: "panel-body"}, 
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
      )
    );
  }
});