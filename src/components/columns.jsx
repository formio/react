var React = require('react');
var FormioComponent = require('../FormioComponent.jsx');

module.exports = React.createClass({
  displayName: 'Column',
  render: function() {
    return (
      <div className="row">
        {this.props.component.columns.map(function(column, index) {
            return (
              <div key={index} className="col-sm-6">
                {column.components.map(function(component) {
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
            );
          }.bind(this))
        }
      </div>
    );
  }
});
