
var React = require('react');
var DropdownList = require('react-widgets/lib/DropdownList');
var Multiselect = require('react-widgets/lib/Multiselect');

module.exports = {
  getInitialState: function() {
    return {
      selectItems: [],
      searchTerm: ''
    }
  },
  valueField: function() {
    var valueField = this.props.component.valueProperty || 'value';
    if (typeof this.getValueField === 'function') {
      valueField = this.getValueField();
    }
    return valueField;
  },
  textField: function() {
    var textField = 'label';
    if (typeof this.getTextField === 'function') {
      textField = this.getTextField();
    }
    return textField;
  },
  onChangeSelect: function(value) {
    if (Array.isArray(value) && this.valueField()) {
      value.forEach(function(val, index) {
        value[index] = val[this.valueField()];
      }.bind(this))
    }
    else if (typeof value === "object" && this.valueField()) {
      value = value[this.valueField()];
    }
    this.setValue(value);
  },
  onSearch: function(text) {
    this.setState({
      searchTerm: text
    });
    if (typeof this.doSearch === 'function') {
      this.doSearch(text);
    }
  },
  getElements: function() {
    // TODO: Need to support custom item rendering in item template.
    var Element = (this.props.component.multiple ? Multiselect : DropdownList);
    var valueField = this.valueField();
    var textField = this.textField();
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
            searchTerm={this.state.searchTerm}
            onSearch={this.onSearch}
            onChange={this.onChangeSelect}
            />
        </div>
      </div>
    );
  }
};