'use strict'

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Panel',
  render: function() {
    var title = (this.props.component.title ? <div className="panel-heading"><h3 className="panel-title">{this.props.component.title}</h3></div> : '');
    var className = "panel panel-" + this.props.component.theme;
    return(
      <div className={className}>
        {title}
        <div className="panel-body">
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
        </div>
      </div>
    );
  }
});