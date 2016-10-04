import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';

module.exports = React.createClass({
  displayName: 'Textarea',
  mixins: [valueMixin, multiMixin],
  getSingleElement: function(value, index) {
    index = index || 0;
    return (
      <textarea
        className="form-control"
        key={index}
        id={this.props.component.key}
        data-index={index}
        name={this.props.name}
        value={value}
        disabled={this.props.readOnly}
        placeholder={this.props.component.placeholder}
        rows={this.props.component.rows}
        onChange={this.onChange}
      >
      </textarea>
    );
  }
});
