import React from 'react';
import { clone } from 'lodash';
import valueMixin from './mixins/valueMixin';
import componentMixin from './mixins/componentMixin';
import { FormioComponentsList } from '../../components';

module.exports = React.createClass({
  displayName: 'Container',
  mixins: [valueMixin, componentMixin],
  getInitialValue: function() {
    return {};
  },
  elementChange: function(component) {
    if (component.props.component.key) {
      this.setState(previousState => {
        // Clone to keep state immutable.
        let value = clone(previousState.value);
        value[component.props.component.key] = component.state.value;
        previousState.value = value;
        // If a component isn't pristing, the container isn't pristine.
        if (!component.state.isPristine && previousState.isPristine) {
          previousState.isPristine = false;
        }
        return previousState;
      }, () => this.props.onChange(component, { container: this }));
    }
  },
  detachFromForm: function(component) {
    if (this.props.unmounting) {
      return;
    }
    let value = clone(this.state.value);
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
