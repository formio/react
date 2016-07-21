'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var FormioComponents = require('./FormioComponents');

module.exports = React.createClass({
  displayName: 'FormioWizard',
  getInitialState: function getInitialState() {
    var pages = [];
    var numPages = 0;
    this.props.components.forEach(function (component, index) {
      if (component.type === 'panel') {
        pages.push(component);
        numPages++;
      }
    });
    return {
      currentPage: 0,
      pages: pages,
      numPages: numPages
    };
  },
  nextPage: function nextPage(event) {
    event.preventDefault();
    console.log('click');
    this.setState(function (previousState) {
      if (previousState.currentPage < numPages - 1) {
        previousState.currentPage++;
      }
      return previousState;
    });
  },
  previousPage: function previousPage() {
    this.setState(function (previousState) {
      if (previousState.currentPage > 0) {
        previousState.currentPage--;
      }
      return previousState;
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'formio-wizard' },
      React.createElement(FormioComponents, _extends({}, this.props, {
        components: this.state.pages[this.state.currentPage].components
      })),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: this.nextPage
        },
        'Next'
      )
    );
  }
});