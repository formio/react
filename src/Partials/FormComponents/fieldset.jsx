import React from 'react';
import FormioComponents from '../FormioComponents';

module.exports = React.createClass({
  displayName: 'Fieldset',
  render: function() {
    var legend = (this.props.component.legend ? <legend>{this.props.component.legend}</legend> : '');
    var className = (this.props.component.customClass) ? this.props.component.customClass : '';
    return (
      <fieldset className={className}>
        {legend}
        <FormioComponents
          {...this.props}
          components={this.props.component.components}
        ></FormioComponents>
      </fieldset>
    );
  }
});
