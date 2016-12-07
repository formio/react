import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';

module.exports = React.createClass({
  displayName: 'Number',
  mixins: [valueMixin, multiMixin, componentMixin],
  getInitialValue: function() {
    return '';
  },
  getSingleElement: function(value, index) {
    index = index || 0;
    return (
      <input
        type={this.props.component.inputType}
        className="form-control"
        id={this.props.component.key}
        data-index={index}
        name={this.props.name}
        value={value}
        disabled={this.props.readOnly}
        placeholder={this.props.component.placeholder}
        mask={this.props.component.inputMask}
        min={this.props.component.validate.min}
        max={this.props.component.validate.max}
        step={this.props.component.validate.step}
        onChange={this.onChange}
        >
      </input>
    );
  }
});
