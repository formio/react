import React from 'react';
import FormioComponents from '../FormioComponents';

module.exports = React.createClass({
  displayName: 'Well',
  render: function() {
    return (
      <div className="well">
        <FormioComponents
          {...this.props}
          components={this.props.component.components}
        ></FormioComponents>
      </div>
    );
  }
});
