'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'Custom',
  render: function render() {
    var value = this.props.data && this.props.data.hasOwnProperty(this.props.component.key) ? this.props.data[this.props.component.key] : '';
    return React.createElement(
      'div',
      { className: 'panel panel-default' },
      React.createElement(
        'div',
        { className: 'panel-body text-muted text-center' },
        'Custom Component (',
        this.props.component.type,
        ')'
      )
    );
  }
});