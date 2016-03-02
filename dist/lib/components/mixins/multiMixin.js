'use strict'

var React = require('react');

module.exports = {
  addFieldValue: function() {
    var values = this.state.value;
    values.push(this.props.component.defaultValue);
    this.setState({
      value: values
    });
  },
  removeFieldValue: function(id) {
    var values = this.state.value;
    values.splice(id, 1);
    this.setState({
      value: values
    });
  },
  getElements: function() {
    var Component;
    var classLabel = "control-label" + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ? React.createElement("label", {htmlFor: this.props.component.key, className: classLabel}, this.props.component.label) : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? React.createElement("span", {className: "glyphicon glyphicon-asterisk form-control-feedback field-required-inline", "aria-hidden": "true"}) : '');
    var className = (this.props.component.prefix || this.props.component.suffix ? 'input-group' : '');
    var prefix = (this.props.component.prefix ? React.createElement("div", {className: "input-group-addon"}, this.props.component.prefix) : '');
    var suffix = (this.props.component.suffix ? React.createElement("div", {className: "input-group-addon"}, this.props.component.suffix) : '');
    var data = this.state.value;
    if (this.props.component.multiple) {
      var rows = data.map(function(value, id) {
        var Element = this.getSingleElement(value, id);
        return (
          React.createElement("tr", {key: id}, 
            React.createElement("td", null, requiredInline, 
              React.createElement("div", {className: className}, 
                prefix, " ", Element, " ", suffix
              )
            ), 
            React.createElement("td", null, React.createElement("a", {onClick: this.removeFieldValue.bind(null, id), className: "btn btn-danger"}, React.createElement("span", {className: "glyphicon glyphicon-remove-circle"})))
          )
        );
      }.bind(this));
      Component =
        React.createElement("div", null, 
          inputLabel, 
          React.createElement("table", {className: "table table-bordered"}, 
            React.createElement("tbody", null, 
              rows, 
              React.createElement("tr", null, 
                React.createElement("td", {colSpan: "2"}, React.createElement("a", {onClick: this.addFieldValue, className: "btn btn-primary"}, React.createElement("span", {className: "glyphicon glyphicon-plus", "aria-hidden": "true"}), " Add another"))
              )
            )
          )
        );
    }
    else {
      var Element = this.getSingleElement(data);
      Component =
        React.createElement("div", null, 
          inputLabel, " ", requiredInline, 
          React.createElement("div", {className: className}, 
            prefix, " ", Element, " ", suffix
          )
        )
    }
    return Component;
  }
};