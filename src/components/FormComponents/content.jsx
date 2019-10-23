import React from 'react';
import createReactClass from 'create-react-class';
import componentMixin from './mixins/componentMixin';
import FormioUtils from 'formiojs/utils';

module.exports = createReactClass({
  displayName: 'Content',
  mixins: [componentMixin],
  render: function() {
    const { component, data, row } = this.props;
    return (
      <div dangerouslySetInnerHTML={{__html: FormioUtils.interpolate(this.props.component.html, {
          data,
          row,
          component,
        })}}></div>
    );
  }
});
