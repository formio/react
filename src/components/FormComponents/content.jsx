import React from 'react';
import createReactClass from 'create-react-class';
import componentMixin from './mixins/componentMixin';

module.exports = createReactClass({
  displayName: 'Content',
  mixins: [componentMixin],
  render: function() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.props.component.html}}></div>
    );
  }
});
