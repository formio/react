import React from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect';
import List from 'react-widgets/lib/List';
import {interpolate, raw} from '../../../util';
import _ from 'lodash';

module.exports = {
  data: {},
  getInitialState: function() {
    this.data = {...this.props.data};
    return {
      selectItems: [],
      searchTerm: '',
      hasNextPage: false
    };
  },
  willReceiveProps: function(nextProps) {
    if (this.props.component.refreshOn) {
      const refreshOn = this.props.component.refreshOn;
      let refresh = false;
      if (refreshOn === 'data') {
        if (!_.isEqual(this.data, nextProps.data)) {
          refresh = true;
        }
      }
      else {
        if ((!this.data.hasOwnProperty(refreshOn) && nextProps.hasOwnProperty(refreshOn)) || this.data[refreshOn] !== nextProps.data[refreshOn]) {
          refresh = true;
        }
        else if (this.props.subData && this.props.subData.hasOwnProperty(refreshOn) && this.props.subData[refreshOn] !== nextProps.subData[refreshOn]) {
          refresh = true;
        }
      }
      if (refresh && this.props.component.clearOnRefresh) {
        this.setValue(this.getDefaultValue());
      }
      if (refresh) {
        this.refreshItems();
      }
    }
    this.data = {...nextProps.data};
  },
  valueField: function() {
    var valueField = this.props.component.valueProperty || 'value';
    if (typeof this.getValueField === 'function') {
      valueField = this.getValueField();
    }
    return valueField;
  },
  textField: function() {
    // Default textfield to rendered output.
    var textField = function(item) {
      if (typeof item !== 'object') {
        return item;
      }
      return interpolate(this.props.component.template, {item: item});
    }.bind(this);
    if (typeof this.getTextField === 'function') {
      textField = this.getTextField();
    }
    return textField;
  },
  onChangeSelect: function(value) {
    if (Array.isArray(value) && this.valueField()) {
      value.forEach(function(val, index) {
        value[index] = (typeof val === 'object' ? _.get(val, this.valueField()) : val);
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
    if (typeof this.refreshItems === 'function' && text) {
      this.refreshItems(text);
    }
  },
  itemComponent: function() {
    var template = this.props.component.template;
    if (!template) {
      return null;
    }

    return React.createClass({
      render: function() {
        if (this.props.item && typeof this.props.item === 'object') {
          // Render the markup raw under this react element
          return React.createElement('span', raw(interpolate(template, {item: this.props.item})));
        }

        return React.createElement('span', {}, this.props.item);
      }
    });
  },
  listComponent: function() {
    var root = this;
    return class extends List {
      render() {
        var loadMore;
        if (root.state.hasNextPage) {
          loadMore = <span className="btn btn-success btn-block" onClick={root.loadMoreItems} >Load More...</span>;
        }
        return (
          <div className="wrapper">
            {super.render()}
            {loadMore}
          </div>
        );
      }
    };
  },
  getElements: function() {
    var Element;
    var properties = {
      data: this.state.selectItems,
      placeholder: this.props.component.placeholder,
      textField: this.textField(),
      value: this.state.value,
      onChange: this.onChangeSelect,
      itemComponent: this.itemComponent(),
      listComponent: this.listComponent()
    };
    if (this.valueField()) {
      properties.valueField = this.valueField();
    }
    var classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ? <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ? <span className='glyphicon glyphicon-asterisk form-control-feedback field-required-inline' aria-hidden='true'></span> : '');
    var className = (this.props.component.prefix || this.props.component.suffix ? 'input-group' : '');
    if (!this.internalFilter) {
      // Disable internal filtering.
      properties.filter = function(dataItem, searchTerm) {
        return true;
      };
      properties.searchTerm = this.state.searchTerm;
      properties.onSearch = this.onSearch;
    }
    else {
      properties.filter = 'contains';
    }
    if (this.props.component.multiple) {
      properties.tagComponent = this.itemComponent();
      Element = React.createElement(Multiselect, properties);
    }
    else {
      properties.valueComponent = this.itemComponent();
      Element = React.createElement(DropdownList, properties);
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
