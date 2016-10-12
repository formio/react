import React from 'react';
import { FormioComponentsList } from '../../components';

module.exports = React.createClass({
  displayName: 'Panel',
  render: function() {
    var title = (this.props.component.title ? <div className='panel-heading'><h3 className='panel-title'>{this.props.component.title}</h3></div> : '');
    var className = 'panel panel-' + this.props.component.theme + ' ' + (this.props.component.customClass ? this.props.component.customClass : '');
    return (
      <div className={className}>
        {title}
        <div className='panel-body'>
          <FormioComponentsList
            {...this.props}
            components={this.props.component.components}
          ></FormioComponentsList>
        </div>
      </div>
    );
  }
});
