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
    var className = 'panel panel-' + this.props.component.theme;
    return React.createElement(
      'div',
      { className: className },
      title,
      React.createElement(
        'div',
        { className: 'panel-body' },
        React.createElement(FormioComponents, _extends({}, this.props, {
          components: this.props.component.components
        }))
      )
    );
  }
});