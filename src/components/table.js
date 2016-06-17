'use strict'

var React = require('react');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Panel',
  render: function() {
    var title = (this.props.component.title ? <div className="panel-heading"><h3 className="panel-title">{this.props.component.title}</h3></div> : '');
    var tableClasses = 'table';
    tableClasses += (this.props.component.striped) ? ' table-striped' : '';
    tableClasses += (this.props.component.bordered) ? ' table-bordered' : '';
    tableClasses += (this.props.component.hover) ? ' table-hover' : '';
    tableClasses += (this.props.component.condensed) ? ' table-condensed' : '';
    return(
      <div className="table-responsive">
        <table className={tableClasses}>
          <thead>
            {this.props.component.header.map(function(header, index) {
              return (
                <th key={index}>{header}</th>
              );
            }.bind(this))}
          </thead>
          <tbody>
            {this.props.component.rows.map(function(row, index) {
              return (
                <tr key={index}>
                  {row.map(function(column, index) {
                    return (
                      <td key={index}>
                        {column.components.map(function(component, index) {
                          var value = (this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '');
                          var key = (component.key) ? component.key : component.type + index;
                          console.log(key, value);
                          return (
                            <FormioComponent
                              {...this.props}
                              key={key}
                              name={component.key}
                              component={component}
                              value={value}
                            />
                          );
                        }.bind(this))}
                      </td>
                    );
                  }.bind(this))}
                </tr>
              );
            }.bind(this))}
          </tbody>
        </table>
      </div>
    );
  }
});