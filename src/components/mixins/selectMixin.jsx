var React = require('react');
var DropdownList = require('react-widgets/lib/DropdownList');
var Multiselect = require('react-widgets/lib/Multiselect');
var util = require('../../util');
var _ = require('lodash');

module.exports = {
  getInitialState: function() {
    return {
      selectItems: [],
      searchTerm: ''
    };
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
        value[index] = _.get(val, this.valueField());
      }.bind(this));
    }
    else if (typeof value === 'object' && this.valueField()) {
      value = _.get(value, this.valueField());
    }
    this.setValue(value);
  },
  onSearch: function(text) {
    this.setState({
      searchTerm: text
    });
    if (typeof this.doSearch === 'function' && text) {
      this.doSearch(text);
    }
  },
  itemComponent: function() {
    var template = this.props.component.template;
    if (!template) {
      return null;
    }

    //helper function to render raw html under a react element.
    function raw(html) {
      return {dangerouslySetInnerHTML: {__html: html}};
    }

    return React.createClass({
      render: function() {
        if (this.props.item && typeof this.props.item === 'object') {
          // Render the markup raw under this react element
          return React.createElement('span', raw(util.interpolate(template, {item: this.props.item})));
        }

        return React.createElement('span', {}, this.props.item);
      }
    });
  },
  getElements: function() {
    var Element;
    var classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ? <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? <span className='glyphicon glyphicon-asterisk form-control-feedback field-required-inline' aria-hidden='true'></span> : '');
    var className = (this.props.component.prefix || this.props.component.suffix ? 'input-group' : '');
    var filter;
    if (typeof this.doSearch === 'function') {
      filter = function(dataItem, searchTerm) {
        return true;
      };
    }
    else {
      filter = 'contains';
    }
    if (this.props.component.multiple) {
      Element = (
        <Multiselect
          data={this.state.selectItems}
          valueField={this.valueField()}
          textField={this.textField()}
          filter={filter}
          value={this.state.value}
          searchTerm={this.state.searchTerm}
          onSearch={this.onSearch}
          onChange={this.onChangeSelect}
          tagComponent={this.itemComponent()}
          itemComponent={this.itemComponent()}
        >
        </Multiselect>
      );
    }
    else {
      Element = (
        <DropdownList
          data={this.state.selectItems}
          valueField={this.valueField()}
          textField={this.textField()}
          filter={filter}
          value={this.state.value}
          searchTerm={this.state.searchTerm}
          onSearch={this.onSearch}
          onChange={this.onChangeSelect}
          valueComponent={this.itemComponent()}
          itemComponent={this.itemComponent()}
        >
        </DropdownList>
      );
    }
    return (
      <div>
        {inputLabel} {requiredInline}
        <div className={className}>
          {Element}
        </div>
      </div>
    );
  }
};
