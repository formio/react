import React from 'react';
import valueMixin from './mixins/valueMixin';
import { FormioComponentsList } from '../../components';

module.exports = React.createClass({
  displayName: 'Container',
  mixins: [valueMixin],
  getInitialValue: function() {
    return {};
  },
  elementChange: function(component) {
    if (component.props.component.key) {
      let value = this.state.value;
      value[component.props.component.key] = component.state.value;
      this.setValue(value);
    }
  },
  detachFromForm: function(component) {
    let value = this.state.value;
    console.log(value);
    if (component.props.component.key && value && value.hasOwnProperty(component.props.component.key)) {
      delete value[component.props.component.key];
      this.setValue(value);
    }
    this.props.detachFromForm(component);
  },
  getElements: function() {
    var classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ?
      <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    return (
      <div className='formio-container'>
        <FormioComponentsList
          {...this.props}
          components={this.props.component.components}
          values={this.state.value}
          onChange={this.elementChange}
          detachFromForm={this.detachFromForm}
        ></FormioComponentsList>
      </div>
    );
  }
});
