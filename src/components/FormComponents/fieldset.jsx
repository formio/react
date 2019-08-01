import React from 'react';
import { FormioComponentsList } from '../../components';

module.exports = class extends React.Component {
  static displayName = 'Fieldset';

  render() {
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
};
