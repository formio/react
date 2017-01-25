import React from 'react';
import { clone } from 'lodash';
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
    var rows = clone(this.state.value);
    rows.push({});
    this.setState(previousState => {
      previousState.value = rows;
      previousState.isPristine = false;
      return previousState;
    }, () => {
      this.props.onChange(this);
    });
  },
  removeRow: function(id) {
    if (this.props.readOnly) {
      return;
    }
    var rows = clone(this.state.value);
    rows.splice(id, 1);
    this.setState({
      value: rows,
      isPristine: false
    }, () => {
      this.props.onChange(this);
    });
  },
  elementChange: function(row, component) {
    this.setState(previousState => {
      // Clone to keep state immutable.
      let value = clone(previousState.value);
      value[row] = clone(value[row]);
      value[row][component.props.component.key] = component.state.value;
      previousState.value = value;
      // If a component isn't pristing, the datagrid isn't pristine.
      if (!component.state.isPristine && previousState.isPristine) {
        previousState.isPristine = false;
      }
      return previousState;
    }, () => this.props.onChange(component, { row, datagrid: this }));
  },
  detachFromForm: function(row, component) {
    if (this.props.unmounting) {
      return;
    }
    let value = clone(this.state.value);
    if (component.props.component.key && value[row] && value[row].hasOwnProperty(component.props.component.key)) {
      delete value[row][component.props.component.key];
      this.setValue(value);
    }
    this.props.detachFromForm(component);
  },
  getElements: function() {
    const { value } = this.state;
    const { component, checkConditional } = this.props;
    let visibleCols = component.components.reduce((prev, col) => {
      prev[col.key] = value.reduce(
        (prev, row) => {
          return prev || checkConditional(col, row);
        }
        , false);
      return prev;
    }, {});
    let classLabel = 'control-label' + ( this.props.component.validate && component.validate.required ? ' field-required' : '');
    let inputLabel = (component.label && !component.hideLabel ? <label htmlFor={component.key} className={classLabel}>{component.label}</label> : '');
    let headers = component.components.map(function(col, index) {
      if (visibleCols[col.key]) {
      //if (this.props.checkConditional(col) || localKeys.indexOf(col.conditional.when) !== -1 || !!col.customConditional) {
        let colLabel = 'control-label' + ( col.validate && col.validate.required ? ' field-required' : '');
        return (
          <th key={index}><label className={colLabel}>{col.label || ''}</label></th>
        );
      }
      else {
        return null;
      }
    }.bind(this));
    var tableClasses = 'table datagrid-table';
    tableClasses += (component.striped) ? ' table-striped' : '';
    tableClasses += (component.bordered) ? ' table-bordered' : '';
    tableClasses += (component.hover) ? ' table-hover' : '';
    tableClasses += (component.condensed) ? ' table-condensed' : '';

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
              {component.components.map(function(col, index) {
                var key = col.key || col.type + index;
                var value = (row.hasOwnProperty(col.key) ? row[col.key] : col.defaultValue || '');
                var FormioElement = FormioComponents.getComponent(col.type);
                if (checkConditional(col, row)) {
                  return (
                    <td key={key}>
                      <FormioElement
                        {...this.props}
                        readOnly={this.props.isDisabled(col)}
                        name={col.key}
                        component={col}
                        onChange={this.elementChange.bind(null, rowIndex)}
                        detachFromForm={this.detachFromForm.bind(null, rowIndex)}
                        value={value}
                        row={row}
                        values={row}
                      />
                    </td>
                  );
                }
                else if (visibleCols[col.key]) {
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
          <span><i className='glyphicon glyphicon-plus' aria-hidden='true'/> { component.addAnother || 'Add Another'}</span>
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
