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
<<<<<<< HEAD
        <FormioElement
          name={this.props.component.key}
          {...this.props}
        />
=======
          <div className={className}>
            <FormioElement
                name={this.props.component.key}
                {...this.props}
            />
          </div>
>>>>>>> 7369a4f5d2fa9f12f2b3699fa61570ec48fab2b1
      );
    }
    else {
      return null;
    }
  }
});
