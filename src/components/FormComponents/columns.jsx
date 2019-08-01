import React from 'react';
import { FormioComponentsList } from '../../components';

module.exports = class extends React.Component {
  static displayName = 'Column';

  render() {
    return (
      <div className='row'>
        {this.props.component.columns.map(function(column, index) {
          const classes = 'col-sm-' + (column.width || 6) +
            (column.offset ? ' col-sm-offset-' + column.offset : '') +
            (column.push ? ' col-sm-push-' + column.push : '') +
            (column.pull ? ' col-sm-pull-' + column.pull : '');
          return (
            <div key={index} className={classes}>
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
};
