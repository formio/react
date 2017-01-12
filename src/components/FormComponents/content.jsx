import React from 'react';
import componentMixin from './mixins/componentMixin';

module.exports = React.createClass({
  displayName: 'Content',
  mixins: [componentMixin],
  render: function() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.props.component.html}}></div>
    );
  }
});
