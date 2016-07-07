var React = require('react');
var FormioComponents = require('../FormioComponents');

module.exports = React.createClass({
  displayName: 'Fieldset',
  render: function() {
    var legend = (this.props.component.legend ? <legend>{this.props.component.legend}</legend> : '');
    return (
      <fieldset>
        {legend}
        <FormioComponents
          {...this.props}
          components={this.props.component.components}
        ></FormioComponents>
      </fieldset>
    );
  }
});
