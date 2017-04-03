import React from 'react';
import valueMixin from './mixins/valueMixin';
import componentMixin from './mixins/componentMixin';
import clone from 'lodash/clone';

module.exports = React.createClass({
  displayName: 'SelectBox',
  mixins: [valueMixin, componentMixin],
  getInitialValue: function() {
    return {};
  },
  onChangeCheckbox: function(key, e) {
    var value = clone(this.state.value);
    value[key] = e.target.checked;
    this.setValue(value);
  },
  getElements: function() {
    var classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ?
      <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ?
      <span className='glyphicon glyphicon-asterisk form-control-feedback field-required-inline'
            aria-hidden='true'></span> : '');
    var checkboxClass = (this.props.component.inline ? 'checkbox-inline' : 'checkbox');
    return (
      <div>
        {inputLabel} {requiredInline}
        <div className="selectbox">
          {this.props.component.values.map((item, index) => {
            var required = 'control-label' + (this.state.value[item.value] ? ' checked' : ' not-checked');
            return (
              <div className={checkboxClass} key={index}>
                <label className={required}>
                  <input
                    type="checkbox"
                    key={this.props.component.key}
                    name={this.props.name}
                    disabled={this.props.readOnly}
                    checked={this.state.value[item.value] || ''}
                    onChange={this.onChangeCheckbox.bind(null, item.value)}
                  />{item.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  getValueDisplay: function(component, data) {
    if (!data) return '';

    return Object.keys(data)
      .filter(function(key) {
        return data[key];
      })
      .map(function(data) {
        component.values.forEach(function(item) {
          if (item.value === data) {
            data = item.label;
          }
        });
        return data;
      })
      .join(', ');
  }
});
