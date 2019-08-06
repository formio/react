import React from 'react';
import { FormioComponentsList } from '../../components';

module.exports = class extends React.Component {
  static displayName = 'Well';

  render() {
    return (
      <div className="well">
        <FormioComponentsList
          {...this.props}
          components={this.props.component.components}
        ></FormioComponentsList>
      </div>
    );
  }
};
