import React from 'react';
import { FormioComponentsList } from '../../components';

module.exports = React.createClass({
  displayName: 'Column',
  render: function() {
    return (
      <div className='row'>
        {this.props.component.columns.map(function(column, index) {
          return (
            <div key={index} className="col-sm-6">
              <FormioComponentsList
                {...this.props}
                components={column.components}
              ></FormioComponentsList>
            </div>
          );
        }.bind(this))}
      </div>
    );
  }
});
