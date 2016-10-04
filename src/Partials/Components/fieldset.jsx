import React from 'react';
import {FormioComponentsList} from '../FormioComponentsList';

module.exports = React.createClass({
  displayName: 'Fieldset',
  render: function() {
    var legend = (this.props.component.legend ? <legend>{this.props.component.legend}</legend> : '');
    var className = (this.props.component.customClass) ? this.props.component.customClass : '';
    return (
      <fieldset className={className}>
        {legend}
        <FormioComponentsList
          {...this.props}
          components={this.props.component.components}
        ></FormioComponentsList>
      </fieldset>
    );
  }
});
