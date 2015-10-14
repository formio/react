
var React = require('react');
var Combobox = require('react-widgets/lib/Combobox');
var Multiselect = require('react-widgets/lib/Multiselect');

module.exports = {
  getInitialState: function() {
    return {
      selectItems: []
    }
  },
  getValueField: function() {
    return this.props.component.valueProperty || 'value';
  },
  onChangeSelect: function(value) {
    if (Array.isArray(value)) {
      value.forEach(function(val, index) {
        value[index] = val[this.getValueField()];
      }.bind(this))
    }
    else if (typeof value === "object") {
      value = value[this.getValueField()];
    }
    this.setValue(value);
  },
  onBlur: function(event) {
    // TODO: Need to stop custom values from saving by clearing on blur.
  },
  getElements: function() {
    // TODO: Need to support custom item rendering in item template.
    var Element = (this.props.component.multiple ? Multiselect : Combobox);
    var valueField = this.getValueField();
    var textField = 'label';
    var classLabel = "control-label" + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ? <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? <span className="glyphicon glyphicon-asterisk form-control-feedback field-required-inline" aria-hidden="true"></span> : '');
    var className = (this.props.component.prefix || this.props.component.suffix ? 'input-group' : '');
    return(
      <div>
        {inputLabel} {requiredInline}
        <div className={className}>
          <Element
            data={this.state.selectItems}
            valueField={valueField}
            textField={textField}
            suggest={true}
            filter="contains"
            value={this.state.value}
            onChange={this.onChangeSelect}
            onBlur={this.onBlur}
            />
        </div>
      </div>
    );
  }
};