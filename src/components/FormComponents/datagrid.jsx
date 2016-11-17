import React from 'react';
import valueMixin from './mixins/valueMixin';
import { FormioComponents } from '../../factories';

module.exports = React.createClass({
  displayName: 'Datagrid',
  mixins: [valueMixin],
  getInitialValue: function() {
    return [{}];
  },
  getDefaultProps: function() {
    return {
      checkConditional: function() {
        return true;
      },
      isDisabled: function() {
        return false;
      }
    }
  },
  addRow: function() {
    if (this.props.readOnly) {
      return;
    }
    var rows = this.state.value;
    rows.push({});
    this.setState({
      value: rows
    });
    this.props.onChange(this);
  },
  removeRow: function(id) {
    if (this.props.readOnly) {
      return;
    }
    var rows = this.state.value;
    rows.splice(id, 1);
    this.setState({
      value: rows
    });
    this.props.onChange(this);
  },
  elementChange: function(row, component) {
    var value = this.state.value;
    value[row][component.props.component.key] = component.state.value;
    this.setValue(value);
  },
  getElements: function() {
    let localKeys = this.props.component.components.map(component => component.key);
    let classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    let inputLabel = (this.props.component.label && !this.props.component.hideLabel ? <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    let headers = this.props.component.components.map(function(component, index) {
      if (this.props.checkConditional(component) || localKeys.indexOf(component.conditional.when) !== -1 || !!component.customConditional) {
        return (
          <th key={index}>{component.label || ''}</th>
        );
      }
      else {
        return null;
      }
    }.bind(this));
    var tableClasses = 'table datagrid-table';
    tableClasses += (this.props.component.striped) ? ' table-striped' : '';
    tableClasses += (this.props.component.bordered) ? ' table-bordered' : '';
    tableClasses += (this.props.component.hover) ? ' table-hover' : '';
    tableClasses += (this.props.component.condensed) ? ' table-condensed' : '';

    return (
    <div className='formio-data-grid'>
      <label className={classLabel}>{inputLabel}</label>
      <table className={tableClasses}>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
        {
          this.state.value.map(function(row, rowIndex) {
          return (
            <tr key={rowIndex}>
              {this.props.component.components.map(function(component, index) {
                var key = component.key || component.type + index;
                var value = (row.hasOwnProperty(component.key) ? row[component.key] : component.defaultValue || '');
                var FormioElement = FormioComponents.getComponent(component.type);
                if (this.props.checkConditional(component, row)) {
                  return (
                    <td key={key}>
                      <FormioElement
                        {...this.props}
                        readOnly={this.props.isDisabled(component)}
                        name={component.key}
                        component={component}
                        onChange={this.elementChange.bind(null, rowIndex)}
                        value={value}
                        subData={{...row}}
                      />
                    </td>
                  );
                }
                else if (localKeys.indexOf(component.key)) {
                  return (
                    <td key={key}>

                    </td>
                  );
                }
                else {
                  return null;
                }
              }.bind(this))}
              <td>
                <a onClick={this.removeRow.bind(this, rowIndex)} className='btn btn-default'>
                  <span className='glyphicon glyphicon-remove-circle'></span>
                </a>
              </td>
            </tr>
          );
        }.bind(this))}
        </tbody>
      </table>
      <div className='datagrid-add'>
        <a onClick={this.addRow} className='btn btn-primary'>
          <span><i className='glyphicon glyphicon-plus' aria-hidden='true'/> { this.props.component.addAnother || 'Add Another'}</span>
        </a>
      </div>
    </div>
    );
  },
  getValueDisplay: function(component, data) {
    var renderComponent = (component, row) => {
      return FormioComponents.getComponent(component.type).prototype.getDisplay(component, row[component.key] || '');
    }
    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
          {
            component.components.map(function(component, index) {
              return (
                <th key={index}>
                  { component.label }
                </th>
              );
            })
          }
          </tr>
        </thead>
        <tbody>
        {
          data.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {
                  component.components.map((subComponent, componentIndex) => {
                    return (
                      <td key={componentIndex}>
                        {renderComponent(subComponent, row)}
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
        </tbody>
      </table>
    );
  }
});
