import React from 'react';
import { clone, isEqual } from 'lodash';
import valueMixin from './mixins/valueMixin';
import { FormioComponents } from '../../factories';

class DataGridRow extends React.Component {
  shouldComponentUpdate = (nextProps) => {
    if (!isEqual(this.props.row, nextProps.row)) {
      return true;
    }

    return false;
  };

  render = () => {
    const { component, rowIndex, row, checkConditional, visibleCols } = this.props;

    return (<tr key={rowIndex}>
      {component.components.map((col, index) => {
        let key = col.key || col.type + index;
        let value = (row.hasOwnProperty(col.key) ? row[col.key] : col.defaultValue || null);
        let FormioElement = FormioComponents.getComponent(col.type);
        if (checkConditional(col, row)) {
          return (
            <td key={key}>
              <FormioElement
                {...this.props}
                readOnly={this.props.isDisabled(col)}
                name={col.key}
                component={col}
                onChange={this.props.elementChange.bind(null, rowIndex)}
                attachToForm={this.props.attachToDatarid.bind(null, rowIndex)}
                detachFromForm={this.props.detachFromDatagrid.bind(null, rowIndex)}
                value={value}
                row={row}
                rowIndex={rowIndex}
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
      })}
      { (!component.hasOwnProperty('validate') || !component.validate.hasOwnProperty('minLength') || value.length > component.validate.minLength) ?
        <td>
          <a onClick={this.props.removeRow.bind(null, rowIndex)} className='btn btn-default'>
            <span className='glyphicon glyphicon-remove-circle'></span>
          </a>
        </td>
        : null}
      </tr>
    );
  }
}

module.exports = React.createClass({
  displayName: 'Datagrid',
  mixins: [valueMixin],
  getInitialValue: function() {
    return [{}];
  },
  customState: function(state) {
    const { component } = this.props;
    let rows = state.value;
    if (component.validate && component.validate.hasOwnProperty('minLength') && rows.length < component.validate.minLength) {
      var toAdd = component.validate.minLength - rows.length;
      for (var i = 0; i < toAdd; i++) {
        rows.push({});
      }
    }
    // If more than maxLength, remove extra rows.
    if (component.validate && component.validate.hasOwnProperty('maxLength') && rows.length < component.validate.maxLength) {
      rows = rows.slice(0, component.validate.maxLength);
    }
    state.value = rows;
    return state;
  },
  setPristine: function(isPristine) {
    if (this.inputs) {
      this.inputs.forEach(row => {
        Object.keys(row).forEach(key => {
          row[key].setState({
            isPristine
          });
        });
      });
    }
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
    this.setState(previousState => {
      previousState.value = rows;
      previousState.isPristine = false;
      return previousState;
    }, () => {
      this.props.onChange(this);
    });
  },
  elementChange: function(row, component) {
    const isValid = this.validateCustom();
    this.setState(previousState => {
      // Clone to keep state immutable.
      let value = clone(previousState.value);
      value[row] = clone(value[row]);
      value[row][component.props.component.key] = component.state.value;
      previousState.value = value;
      previousState.isValid = isValid.isValid;
      // If a component isn't pristine, the datagrid isn't pristine.
      if (!component.state.isPristine && previousState.isPristine) {
        previousState.isPristine = false;
      }
      return previousState;
    }, () => this.props.onChange(component, { row, datagrid: this }));
  },
  attachToDatarid(row, component) {
    this.inputs = this.inputs || [];
    this.inputs[row] = this.inputs[row] || {};
    this.inputs[row][component.props.component.key] = component;
    this.setState(previousState => {
      return Object.assign(previousState, this.validate());
    }, () => {
      this.props.onChange(this);
    });
  },
  detachFromDatagrid: function(row, component) {
    if (this.unmounting) {
      return;
    }
    let value = clone(this.state.value);
    if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
      if (component.props.component.key && value[row] && value[row].hasOwnProperty(component.props.component.key)) {
        delete value[row][component.props.component.key];
        this.setValue(value);
      }
    }
    delete this.inputs[row][component.props.component.key];
    if (Object.keys(this.inputs[row]).length === 0) {
      delete this.inputs[row];
    }
    this.setState(previousState => {
      return Object.assign(previousState, this.validate());
    }, () => {
      this.props.onChange(this);
    });
  },
  validateCustom: function() {
    let isValid = true;
    // If any inputs are false, the datagrid is false.
    if (this.inputs) {
      this.inputs.forEach(row => {
        Object.keys(row).forEach(key => {
          if (row[key].state.isValid === false) {
            isValid = false;
          }
        });
      });
    }
    return {
      isValid,
      errorType: '',
      errorMessage: ''
    };
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
    let headers = component.components.map((col, index) => {
      if (visibleCols[col.key]) {
        let colLabel = 'control-label' + ( col.validate && col.validate.required ? ' field-required' : '');
        return (
          <th key={index}><label className={colLabel}>{col.label || ''}</label></th>
        );
      }
      else {
        return null;
      }
    });
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
          value.map((row, rowIndex) => {
          return (
            <DataGridRow
              elementChange={this.elementChange}
              attachToDatarid={this.attachToDatarid}
              detachFromDatagrid={this.detachFromDatagrid}
              removeRow={this.removeRow}
              visibleCols={visibleCols}
              row={row}
              rowIndex={rowIndex}
              key={rowIndex}
              {...this.props}
            />
         );
        })}
        </tbody>
      </table>
      { (!component.hasOwnProperty('validate') || !component.validate.hasOwnProperty('maxLength') || value.length < component.validate.maxLength) ?
        <div className='datagrid-add'>
          <a onClick={this.addRow} className='btn btn-primary'>
            <span><i className='glyphicon glyphicon-plus' aria-hidden='true'/> { component.addAnother || 'Add Another'}</span>
          </a>
        </div>
      : null}
    </div>
    );
  },
  getValueDisplay: function(component, data) {
    var renderComponent = (component, row) => {
      return FormioComponents.getComponent(component.type).prototype.getDisplay(component, row[component.key] || null);
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
