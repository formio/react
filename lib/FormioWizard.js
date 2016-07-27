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
    this.setState(function (previousState) {
      if (previousState.currentPage < previousState.numPages - 1) {
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
    var pages = this.state.pages;
    var pageArray = [];

    for (var i = 0; i < pages.length; i++) {
      var curPageClassName = 'col-sm-2 bs-wizard-step';
      var innerDot = 'bs-wizard-dot-inner';

      if (i === this.state.currentPage) {
        curPageClassName += ' active';
        innerDot += ' bg-success';
      } else {
        curPageClassName += ' disabled';
      }

      pageArray.push(React.createElement(
        'div',
        { className: curPageClassName },
        React.createElement(
          'div',
          { className: 'text-center bs-wizard-stepnum' },
          pages[i].title
        ),
        React.createElement(
          'div',
          { className: 'progress' },
          React.createElement('div', { className: 'progress-bar progress-bar-primary' })
        ),
        React.createElement(
          'a',
          { className: 'bs-wizard-dot bg-primary' },
          React.createElement('div', { className: innerDot })
        )
      ));
    }

    return React.createElement(
      'div',
      { className: 'formio-wizard' },
      React.createElement(
        'div',
        { className: 'panel panel-default' },
        React.createElement(
          'div',
          { className: 'panel-heading' },
          React.createElement(
            'h3',
            { className: 'panel-title' },
            'Preview'
          )
        ),
        React.createElement(
          'div',
          { className: 'panel-body' },
          React.createElement(
            'div',
            { className: 'formio-wizard-wrapper' },
            React.createElement(
              'div',
              { className: 'row bs-wizard hasTitles' },
              pageArray
            ),
            React.createElement(FormioComponents, _extends({}, this.props, {
              components: this.state.pages[this.state.currentPage].components
            })),
            React.createElement('input', { type: 'button', onClick: function () {
                this.nextPage.apply(this, arguments);
              }.bind(this) /*this.nextPage*/, value: 'NEXT' })
          )
        )
      )
    );
  }
});