import React from 'react';
import ReactQuill from 'react-quill';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';

module.exports = React.createClass({
  displayName: 'Textarea',
  mixins: [valueMixin, multiMixin, componentMixin],
  customState: function(state) {
    const { component, readOnly } = this.props;
    this.isWysiwig = false;
    if (!readOnly && component.wysiwyg) {
      this.isWysiwig = true;
    }
    return state;
  },
  onChangeWysiwyg: function(index, value) {
    this.setValue(value, index);
  },
  getSingleElement: function(value, index) {
    const { component, name, readOnly } = this.props;
    index = index || 0;
    if (this.isWysiwig) {
      return (
        <ReactQuill
          key={index}
          id={component.key}
          data-index={index}
          name={name}
          value={value}
          theme="snow"
          disabled={readOnly}
          placeholder={component.placeholder}
          rows={component.rows}
          onChange={this.onChangeWysiwyg.bind(null, index)}
        />
      );
    }
    else {
      return (
        <textarea
          className="form-control"
          key={index}
          id={component.key}
          data-index={index}
          name={name}
          value={value}
          disabled={readOnly}
          placeholder={component.placeholder}
          rows={component.rows}
          onChange={this.onChange}
        >
        </textarea>
      );
    }
  }
});
