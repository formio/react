var React = require('react');
var valueMixin = require('./mixins/valueMixin');

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
      }
    }
  },
  addRow: function() {
    var rows = this.state.value;
    rows.push({});
    this.setState({
      value: rows
    });
    this.props.onChange(this);
  },
  removeRow: function(id) {
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
    this.setState({
      value: value
    });
    this.props.onChange(this);
  },
  getElements: function() {
    let localKeys = this.props.component.components.map(component => component.key);
    let classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    let inputLabel = (this.props.component.label && !this.props.component.hideLabel ? <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    let headers = this.props.component.components.map(function(component, index) {
      if (this.props.checkConditional(component) || localKeys.indexOf(component.conditional.when) !== -1) {
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
                // FormioComponents is a global variable so external scripts can define custom components.
                var FormioElement;
                if (FormioComponents[component.type]) {
                  FormioElement = FormioComponents[component.type];
                }
                else {
                  FormioElement = FormioComponents['custom'];
                }
                if (this.props.checkConditional(component, row)) {
                  return (
                    <td key={key}>
                      <FormioElement
                        {...this.props}
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
  }
});
