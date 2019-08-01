import React from 'react';
import createReactClass from 'create-react-class';
import valueMixin from './mixins/valueMixin';
import componentMixin from './mixins/componentMixin';

module.exports = createReactClass({
  mixins: [valueMixin, componentMixin],
  displayName: 'Hidden',
  getElements: function() {
    var value = (this.state && this.state.hasOwnProperty('value')) ? this.state.value : '';
    return (
      <input type="hidden" id={this.props.component.key} name={this.props.component.key} value={value}></input>
    );
  }
});
