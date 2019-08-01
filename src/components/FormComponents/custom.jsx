import React from 'react';
import createReactClass from 'create-react-class';
import componentMixin from './mixins/componentMixin';

module.exports = createReactClass({
  displayName: 'Custom',
  mixins: [componentMixin],
  render: function() {
    var value = (this.props.data && this.props.data.hasOwnProperty(this.props.component.key)) ? this.props.data[this.props.component.key] : '';
    return (
      <div className="panel panel-default">
        <div className="panel-body text-muted text-center">
          Custom Component ({ this.props.component.type })
        </div>
      </div>
    );
  }
});
