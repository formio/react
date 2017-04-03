import React from 'react';
import clone from 'lodash/clone';
import valueMixin from './mixins/valueMixin';
import componentMixin from './mixins/componentMixin';
import { FormioComponentsList } from '../../components';

module.exports = React.createClass({
  displayName: 'Container',
  mixins: [valueMixin, componentMixin],
  getInitialValue: function() {
    return {};
  },
  setPristine: function(isPristine) {
    if (this.inputs) {
      Object.keys(this.inputs).forEach(key => {
        this.inputs[key].setState({
          isPristine
        });
      });
    }
  },
  elementChange: function(component) {
    const isValid = this.validateCustom();
    if (component.props.component.key) {
      this.setState(previousState => {
        // Clone to keep state immutable.
        let value = clone(previousState.value);
        value[component.props.component.key] = component.state.value;
        previousState.value = value;
        previousState.isValid = isValid.isValid;
        // If a component isn't pristine, the container isn't pristine.
        if (!component.state.isPristine && previousState.isPristine) {
          previousState.isPristine = false;
        }
        return previousState;
      }, () => this.props.onChange(component, { container: this }));
    }
  },
  attachToForm: function(component) {
    this.inputs = this.inputs || {};
    this.inputs[component.props.component.key] = component;
    this.setState(previousState => {
      return Object.assign(previousState, this.validate());
    }, () => {
      this.props.onChange(this);
    });
  },
  detachFromForm: function(component) {
    if (this.unmounting) {
      return;
    }
    let value = clone(this.state.value);
    if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
      if (component.props.component.key && value && value.hasOwnProperty(component.props.component.key)) {
        delete value[component.props.component.key];
        this.setValue(value);
      }
    }
    delete this.inputs[component.props.component.key];
    this.setState(previousState => {
      return Object.assign(previousState, this.validate());
    }, () => {
      this.props.onChange(this);
    });
  },
  validateCustom: function() {
    let isValid = true;
    // If any inputs are false, the datagrid is false.
    if (this.inputs) {
      Object.keys(this.inputs).forEach(key => {
        if (this.inputs[key].state.isValid === false) {
          isValid = false;
        }
      });
    }
    return {
      isValid,
      errorType: '',
      errorMessage: ''
    };
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
          attachToForm={this.attachToForm}
          detachFromForm={this.detachFromForm}
        ></FormioComponentsList>
      </div>
    );
  }
});
