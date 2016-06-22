'use strict'

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
  displayName: 'Datagrid',
  mixins: [valueMixin],
  getInitialValue: function() {
    return [{}];
  },
  addRow: function() {
    var rows = this.state.value;
    rows.push({});
    this.setState({
      value: rows
    });
  },
  removeRow: function(id) {
    var rows = this.state.value;
    rows.splice(id, 1);
    this.setState({
      value: rows
    });
  },
  getElements: function() {
    var classLabel = "control-label" + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ? <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var headers = this.props.component.components.map(function(component, index) {
      return (
        <th key={index}>{component.label || ''}</th>
      )
    });
    var tableClasses = 'table datagrid-table';
    tableClasses += (this.props.component.striped) ? ' table-striped' : '';
    tableClasses += (this.props.component.bordered) ? ' table-bordered' : '';
    tableClasses += (this.props.component.hover) ? ' table-hover' : '';
    tableClasses += (this.props.component.condensed) ? ' table-condensed' : '';

    return (
    <div className="formio-data-grid">
      <label className={classLabel}>{inputLabel}</label>
      <table className={tableClasses}>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
        {
          this.state.value.map(function(row, index) {
          return (
            <tr key={index}>
              {this.props.component.components.map(function(component, index) {
                var value = (row.hasOwnProperty(component.key) ? row[component.key] : component.defaultValue || '');
                var key = (component.key) ? component.key : component.type + index;
                return (
                  <td key={key}>
                    <FormioComponent
                      {...this.props}
                      name={component.key}
                      component={component}
                      value={value}
                    />
                  </td>
                );
              }.bind(this))}
              <td>
                <a onClick={this.removeRow.bind(this, index)} className="btn btn-default">
                  <span className="glyphicon glyphicon-remove-circle"></span>
                </a>
              </td>
            </tr>
          );
        }.bind(this))}
        </tbody>
      </table>
      <div className="datagrid-add">
        <a onClick={this.addRow} className="btn btn-primary">
          <span className="glyphicon glyphicon-plus" aria-hidden="true"> { this.props.component.addAnother || "Add Another"}</span>
        </a>
      </div>
    </div>
    );
  }
});