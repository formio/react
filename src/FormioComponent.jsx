var React = require('react');

module.exports = React.createClass({
  displayName: 'FormioComponent',
  render: function() {
    // FormioComponents is a global variable so external scripts can define custom components.
    var FormioElement;
    if (FormioComponents[this.props.component.type]) {
      FormioElement = FormioComponents[this.props.component.type];
    }
    else {
      FormioElement = FormioComponents['custom'];
    }
    if (this.props.checkConditional(this)) {
      return (
        <FormioElement
          name={this.props.component.key}
          {...this.props}
        />
      );
    } else {
      return null;
    }
  }
});
