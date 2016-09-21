'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var valueMixin = require('./mixins/valueMixin');

module.exports = React.createClass({
  displayName: 'Datagrid',
  mixins: [valueMixin],
  getInitialValue: function getInitialValue() {
    return [{}];
  },
  getDefaultProps: function getDefaultProps() {
    return {
      checkConditional: function checkConditional() {
        return true;
      }
    };
  },
  addRow: function addRow() {
    var rows = this.state.value;
    rows.push({});
    this.setState({
      value: rows
    });
    this.props.onChange(this);
  },
  removeRow: function removeRow(id) {
    var rows = this.state.value;
    rows.splice(id, 1);
    this.setState({
      value: rows
    });
    this.props.onChange(this);
  },
  elementChange: function elementChange(row, component) {
    var value = this.state.value;
    value[row][component.props.component.key] = component.state.value;
    this.setState({
      value: value
    });
    this.props.onChange(this);
  },
  getElements: function getElements() {
    var localKeys = this.props.component.components.map(function (component) {
      return component.key;
    });
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var headers = this.props.component.components.map(function (component, index) {
      if (this.props.checkConditional(component) || localKeys.indexOf(component.conditional.when) !== -1) {
        return React.createElement(
          'th',
          { key: index },
          component.label || ''
        );
      } else {
        return null;
      }
    }.bind(this));
    var tableClasses = 'table datagrid-table';
    tableClasses += this.props.component.striped ? ' table-striped' : '';
    tableClasses += this.props.component.bordered ? ' table-bordered' : '';
    tableClasses += this.props.component.hover ? ' table-hover' : '';
    tableClasses += this.props.component.condensed ? ' table-condensed' : '';

    return React.createElement(
      'div',
      { className: 'formio-data-grid' },
      React.createElement(
        'label',
        { className: classLabel },
        inputLabel
      ),
      React.createElement(
        'table',
        { className: tableClasses },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            headers
          )
        ),
        React.createElement(
          'tbody',
          null,
          this.state.value.map(function (row, rowIndex) {
            return React.createElement(
              'tr',
              { key: rowIndex },
              this.props.component.components.map(function (component, index) {
                var key = component.key || component.type + index;
                var value = row.hasOwnProperty(component.key) ? row[component.key] : component.defaultValue || '';
                // FormioComponents is a global variable so external scripts can define custom components.
                var FormioElement;
                if (FormioComponents[component.type]) {
                  FormioElement = FormioComponents[component.type];
                } else {
                  FormioElement = FormioComponents['custom'];
                }
                if (this.props.checkConditional(component, row)) {
                  return React.createElement(
                    'td',
                    { key: key },
                    React.createElement(FormioElement, _extends({}, this.props, {
                      name: component.key,
                      component: component,
                      onChange: this.elementChange.bind(null, rowIndex),
                      value: value,
                      subData: _extends({}, row)
                    }))
                  );
                } else if (localKeys.indexOf(component.key)) {
                  return React.createElement('td', { key: key });
                } else {
                  return null;
                }
              }.bind(this)),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'a',
                  { onClick: this.removeRow.bind(this, rowIndex), className: 'btn btn-default' },
                  React.createElement('span', { className: 'glyphicon glyphicon-remove-circle' })
                )
              )
            );
          }.bind(this))
        )
      ),
      React.createElement(
        'div',
        { className: 'datagrid-add' },
        React.createElement(
          'a',
          { onClick: this.addRow, className: 'btn btn-primary' },
          React.createElement(
            'span',
            null,
            React.createElement('i', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
            ' ',
            this.props.component.addAnother || 'Add Another'
          )
        )
      )
    );
  }
});