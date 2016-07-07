'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponents = require('../FormioComponents');

module.exports = React.createClass({
  displayName: 'Column',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'row' },
      this.props.component.columns.map(function (column, index) {
        return React.createElement(
          'div',
          { key: index, className: 'col-sm-6' },
          React.createElement(FormioComponents, _extends({}, this.props, {
            components: column.components
          }))
        );
      }.bind(this))
    );
  }
});