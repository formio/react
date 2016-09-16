'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var DropdownList = require('react-widgets/lib/DropdownList');
var Multiselect = require('react-widgets/lib/Multiselect');
var List = require('react-widgets/lib/List');
var util = require('../../util');
var _ = require('lodash');

module.exports = {
  getInitialState: function getInitialState() {
    return {
      selectItems: [],
      searchTerm: '',
      hasNextPage: false
    };
  },
  valueField: function valueField() {
    var valueField = this.props.component.valueProperty || 'value';
    if (typeof this.getValueField === 'function') {
      valueField = this.getValueField();
    }
    return valueField;
  },
  textField: function textField() {
    // Default textfield to rendered output.
    var textField = function (item) {
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
        return item;
      }
      return util.interpolate(this.props.component.template, { item: item });
    }.bind(this);
    if (typeof this.getTextField === 'function') {
      textField = this.getTextField();
    }
    return textField;
  },
  onChangeSelect: function onChangeSelect(value) {
    if (Array.isArray(value) && this.valueField()) {
      value.forEach(function (val, index) {
        value[index] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? _.get(val, this.valueField()) : val;
      }.bind(this));
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && this.valueField()) {
      value = _.get(value, this.valueField());
    }
    this.setValue(value);
  },
  onSearch: function onSearch(text) {
    this.setState({
      searchTerm: text
    });
    if (typeof this.refreshItems === 'function' && text) {
      this.refreshItems(text);
    }
  },
  itemComponent: function itemComponent() {
    var template = this.props.component.template;
    if (!template) {
      return null;
    }

    //helper function to render raw html under a react element.
    function raw(html) {
      return { dangerouslySetInnerHTML: { __html: html } };
    }

    return React.createClass({
      render: function render() {
        if (this.props.item && _typeof(this.props.item) === 'object') {
          // Render the markup raw under this react element
          return React.createElement('span', raw(util.interpolate(template, { item: this.props.item })));
        }

        return React.createElement('span', {}, this.props.item);
      }
    });
  },
  listComponent: function listComponent() {
    var root = this;
    return function (_List) {
      _inherits(_class, _List);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
      }

      _createClass(_class, [{
        key: 'render',
        value: function render() {
          var loadMore;
          if (root.state.hasNextPage) {
            loadMore = React.createElement(
              'span',
              { className: 'btn btn-success btn-block', onClick: root.loadMoreItems },
              'Load More...'
            );
          }
          return React.createElement(
            'div',
            { className: 'wrapper' },
            _get(Object.getPrototypeOf(_class.prototype), 'render', this).call(this),
            loadMore
          );
        }
      }]);

      return _class;
    }(List);
  },
  getElements: function getElements() {
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
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? React.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? React.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';
    var className = this.props.component.prefix || this.props.component.suffix ? 'input-group' : '';
    if (!this.internalFilter) {
      // Disable internal filtering.
      properties.filter = function (dataItem, searchTerm) {
        return true;
      };
      properties.searchTerm = this.state.searchTerm;
      properties.onSearch = this.onSearch;
    } else {
      properties.filter = 'contains';
    }
    if (this.props.component.multiple) {
      properties.tagComponent = this.itemComponent();
      Element = React.createElement(Multiselect, properties);
    } else {
      properties.valueComponent = this.itemComponent();
      Element = React.createElement(DropdownList, properties);
    }
    return React.createElement(
      'div',
      null,
      inputLabel,
      ' ',
      requiredInline,
      React.createElement(
        'div',
        { className: className },
        Element
      )
    );
  }
};