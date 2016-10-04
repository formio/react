import React from 'react';
import {FormioComponentsList} from '../FormioComponentsList';

module.exports = React.createClass({
  displayName: 'Panel',
  render: function() {
    var title = (this.props.component.title ? <div className="panel-heading"><h3 className="panel-title">{this.props.component.title}</h3></div> : '');
    var tableClasses = 'table';
    tableClasses += (this.props.component.striped) ? ' table-striped' : '';
    tableClasses += (this.props.component.bordered) ? ' table-bordered' : '';
    tableClasses += (this.props.component.hover) ? ' table-hover' : '';
    tableClasses += (this.props.component.condensed) ? ' table-condensed' : '';
    tableClasses += (this.props.component.customClass) ? ' ' + this.props.component.customClass : '';
    return (
      <div className="table-responsive">
        {title}
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
                        <FormioComponentsList
                          {...this.props}
                          components={column.components}
                        ></FormioComponentsList>
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
