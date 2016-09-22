import React from 'react';
import FormioComponents from '../FormioComponents';

module.exports = React.createClass({
  displayName: 'Column',
  render: function() {
    return (
      <div className='row'>
        {this.props.component.columns.map(function(column, index) {
          return (
            <div key={index} className="col-sm-6">
              <FormioComponents
                {...this.props}
                components={column.components}
              ></FormioComponents>
            </div>
          );
        }.bind(this))}
      </div>
    );
  }
});
