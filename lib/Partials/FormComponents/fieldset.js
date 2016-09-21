'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponents = require('../FormioComponents');

module.exports = React.createClass({
  displayName: 'Fieldset',
  render: function render() {
    var legend = this.props.component.legend ? React.createElement(
      'legend',
      null,
      this.props.component.legend
    ) : '';
    var className = this.props.component.customClass ? this.props.component.customClass : '';
    return React.createElement(
      'fieldset',
      { className: className },
      legend,
      React.createElement(FormioComponents, _extends({}, this.props, {
        components: this.props.component.components
      }))
    );
  }
});