import React from 'react';
import valueMixin from './mixins/valueMixin';
import componentMixin from './mixins/componentMixin';

module.exports = React.createClass({
  displayName: 'Checkbox',
  mixins: [valueMixin, componentMixin],
  onChangeCheckbox: function(event) {
    this.setValue(event.target.checked);
  },
  getElements: function() {
    const { component } = this.props;
    const { value } = this.state;
    var required = 'control-label' + (component.validate.required ? ' field-required' : '') + (value ? ' checked' : ' not-checked');
    return (
      <div className="checkbox">
        <label className={required}>
          <input
            type="checkbox"
            id={component.key}
            name={this.props.name}
            checked={value}
            disabled={this.props.readOnly}
            onChange={this.onChangeCheckbox}
          />
          { !(component.hideLabel && component.datagridLabel === false) ? component.label : '' }
        </label>
      </div>
    );
  },
  getValueDisplay: function(component, data) {
    return data ? 'Yes' : 'No';
  }
});
