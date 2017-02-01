import React from 'react';
import { clone } from 'lodash';

module.exports = {
  addFieldValue: function() {
    let value = clone(this.state.value);
    value.push(this.props.component.defaultValue);
    this.setState(previousState => {
      return previousState.value = value;
    }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this);
      }
    });
  },
  removeFieldValue: function(id) {
    let value = clone(this.state.value);
    value.splice(id, 1);
    this.setState(previousState => {
      return previousState.value = value;
    }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this);
      }
    });
  },
  getElements: function() {
    const { component } = this.props;
    var Component;
    var classLabel = 'control-label' + ( component.validate && component.validate.required ? ' field-required' : '');
    var inputLabel = (component.label && !component.hideLabel ? <label htmlFor={component.key} className={classLabel}>{component.label}</label> : '');
    var requiredInline = ((component.hideLabel === true || component.label === '' || !component.label) && component.validate && component.validate.required ? <span className='glyphicon glyphicon-asterisk form-control-feedback field-required-inline' aria-hidden='true'></span> : '');
    var prefix = (component.prefix ? <div className='input-group-addon'>{component.prefix}</div> : '');
    var suffix = (component.suffix ? <div className='input-group-addon'>{component.suffix}</div> : '');
    var data = this.state.value;
    if (component.multiple) {
      var rows = data.map(function(value, id) {
        var Element = this.getSingleElement(value, id);
        return (
          <tr key={id}>
            <td>
              <div className='input-group'>
                {prefix} {Element} {requiredInline} {suffix}
              </div>
            </td>
            <td><a onClick={this.removeFieldValue.bind(null, id)} className={'btn btn-danger remove-row remove-row-' + id}>
              <span className='glyphicon glyphicon-remove-circle'></span></a>
            </td>
          </tr>
        );
      }.bind(this));
      Component =
        <div className='formio-component-multiple'>
          {inputLabel}
          <table className='table table-bordered'>
            <tbody>
              {rows}
              <tr>
                <td colSpan='2'><a onClick={this.addFieldValue} className='btn btn-primary add-row'>
                  <span className='glyphicon glyphicon-plus' aria-hidden='true'></span> Add another</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>;
    }
    else {
      var Element = this.getSingleElement(data);
      Component =
        <div className='formio-component-single'>
          {inputLabel}
          <div className='input-group'>
            {prefix} {Element} {requiredInline} {suffix}
          </div>
        </div>;
    }
    return Component;
  }
};
