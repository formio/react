'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponents = require('../FormioComponents');

module.exports = React.createClass({
  displayName: 'Panel',
  render: function render() {
    var title = this.props.component.title ? React.createElement(
      'div',
      { className: 'panel-heading' },
      React.createElement(
        'h3',
        { className: 'panel-title' },
        this.props.component.title
      )
    ) : '';
    var tableClasses = 'table';
    tableClasses += this.props.component.striped ? ' table-striped' : '';
    tableClasses += this.props.component.bordered ? ' table-bordered' : '';
    tableClasses += this.props.component.hover ? ' table-hover' : '';
    tableClasses += this.props.component.condensed ? ' table-condensed' : '';
    return React.createElement(
      'div',
      { className: 'table-responsive' },
      title,
      React.createElement(
        'table',
        { className: tableClasses },
        React.createElement(
          'thead',
          null,
          this.props.component.header.map(function (header, index) {
            return React.createElement(
              'th',
              { key: index },
              header
            );
          }.bind(this))
        ),
        React.createElement(
          'tbody',
          null,
          this.props.component.rows.map(function (row, index) {
            return React.createElement(
              'tr',
              { key: index },
              row.map(function (column, index) {
                return React.createElement(
                  'td',
                  { key: index },
                  React.createElement(FormioComponents, _extends({}, this.props, {
                    components: column.components
                  }))
                );
              }.bind(this))
            );
          }.bind(this))
        )
      )
    );
  }
});