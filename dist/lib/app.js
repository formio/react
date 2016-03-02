
var React = require('react');
var Formio = require('./Formio');

var Demo = React.createClass({
  displayName: 'Demo',
  getInitialState: function() {
    return {
      src: '',
      inputSrc: ''
    }
  },
  setInputSrc: function(event) {
    this.setState({
      inputSrc: event.currentTarget.value
    });
  },
  setSrc: function() {
    this.setState({
      src: this.state.inputSrc
    });
  },
  resetSrc: function() {
    this.setState({
      src: ''
    });
  },
  render: function() {
    var contents = (this.state.src ? React.createElement(Formio, {src: this.state.src}) :
      React.createElement("form", null, 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", {htmlFor: "form"}, "Form API Url:"), 
          React.createElement("input", {type: "textfield", name: "form", className: "form-control", value: this.state.inputSrc, onChange: this.setInputSrc})
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("a", {className: "btn btn-primary", onClick: this.setSrc}, "Show Form!")
        )
      )
    );
    return (
      React.createElement("div", {className: "panel panel-default"}, 
        React.createElement("div", {className: "panel-heading"}, 
          "Enter the form API url into the box below and press ", React.createElement("strong", null, "Show Form"), " to view the form."
        ), 
        React.createElement("div", {className: "panel-body"}, 
          contents
        ), 
        React.createElement("div", {className: "panel-footer"}, 
          React.createElement("a", {className: "btn btn-primary", onClick: this.resetSrc}, "Reset")
        )
      )
    );
  }
});

React.render(
  React.createElement(Demo, null)
  , document.getElementById('formio')
);