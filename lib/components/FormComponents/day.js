'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Textfield',
  mixins: [_valueMixin2.default, _multiMixin2.default, _componentMixin2.default],
  onChangeCustom: function onChangeCustom() {
    var padLeft = function padLeft(nr, n, str) {
      return Array(n - String(nr.toString()).length + 1).join(str || '0') + nr.toString();
    };
    var date = this.state.date;


    if (this.props.component.dayFirst) {
      this.setValue(padLeft(date.day, 2) + '/' + padLeft(date.month, 2) + '/' + padLeft(date.year, 4));
    } else {
      this.setValue(padLeft(date.month, 2) + '/' + padLeft(date.day, 2) + '/' + padLeft(date.year, 4));
    }
  },
  validateCustom: function validateCustom(value) {
    var required = this.props.component.fields.day.required || this.props.component.fields.month.required || this.props.component.fields.year.required;
    var state = {
      isValid: true,
      errorMessage: ''
    };
    if (!required) {
      return state;
    }
    if (!value && required) {
      state = {
        isValid: false,
        errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
      };
    }
    var parts = value.split('/');
    if (this.props.component.fields.day.required) {
      if (parts[this.props.component.dayFirst ? 0 : 1] === '00') {
        state = {
          isValid: false,
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
        };
      }
    }
    if (this.props.component.fields.month.required) {
      if (parts[this.props.component.dayFirst ? 1 : 0] === '00') {
        state = {
          isValid: false,
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
        };
      }
    }
    if (this.props.component.fields.year.required) {
      if (parts[2] === '0000') {
        state = {
          isValid: false,
          errorMessage: (this.props.component.label || this.props.component.key) + ' must be a valid date.'
        };
      }
    }
    return state;
  },
  customState: function customState(state) {
    state.date = {
      day: '',
      month: '',
      year: ''
    };
    if (state.value) {
      var parts = state.value.split('/');
      state.date.day = parts[this.props.component.dayFirst ? 0 : 1];
      state.date.month = parseInt(parts[this.props.component.dayFirst ? 1 : 0]).toString();
      state.date.year = parts[2];
    }
    return state;
  },
  willReceiveProps: function willReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      if (!nextProps.value) {
        return;
      }
      var parts = nextProps.value.split('/');
      this.setState({
        date: {
          day: parts[this.props.component.dayFirst ? 0 : 1],
          month: parseInt(parts[this.props.component.dayFirst ? 1 : 0]).toString(),
          year: parts[2]
        }
      });
    }
  },
  getDatePart: function getDatePart(config) {
    var _this = this;

    var classes = config.required ? 'field-required' : '';

    var constrainValue = function constrainValue(event) {
      var value = event.target.value;

      if (value.length > config.characters) {
        value = value.substring(0, config.characters);
      }
      if (isNaN(value)) {
        value = value.replace(/\D/g, '');
      }
      if (parseInt(value) < parseInt(config.min) || parseInt(value) > parseInt(config.max)) {
        value = value.substring(0, config.characters - 1);
      }

      _this.setState(function (state) {
        state.date[config.key] = value;
        return state;
      }, _this.onChangeCustom);
    };

    return _react2.default.createElement(
      'div',
      { className: 'form-group control-label col-xs-' + config.columns },
      _react2.default.createElement(
        'label',
        { htmlFor: config.componentId, className: classes },
        config.title
      ),
      _react2.default.createElement('input', {
        className: 'form-control',
        type: 'text',
        id: config.componentId,
        style: { paddingRight: '10px' },
        placeholder: config.placeholder,
        value: this.state.date[config.key],
        onChange: constrainValue,
        disabled: this.props.readOnly
      })
    );
  },
  getDay: function getDay(componentId, field) {
    if (field.hide) {
      return null;
    }
    return this.getDatePart({
      key: 'day',
      componentId: componentId + '-day',
      title: 'Day',
      placeholder: field.placeholder,
      required: field.required,
      columns: 3,
      min: 0,
      max: 31,
      characters: 2
    });
  },
  getMonth: function getMonth(componentId, field) {
    var _this2 = this;

    if (field.hide) {
      return null;
    }
    var classes = field.required ? 'field-required' : '';
    var options = [field.placeholder, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var onChangeMonth = function onChangeMonth(event) {
      var value = event.target.value;

      _this2.setState(function (state) {
        state.date['month'] = value;
        return state;
      }, _this2.onChangeCustom);
    };
    return _react2.default.createElement(
      'div',
      { className: 'form-group control-label col-xs-4' },
      _react2.default.createElement(
        'label',
        { htmlFor: componentId + '-month', className: classes },
        'Month'
      ),
      _react2.default.createElement(
        'select',
        { className: 'form-control',
          type: 'text',
          id: componentId + '-month',
          disabled: this.props.readOnly,
          value: this.state.date.month,
          onChange: onChangeMonth
        },
        options.map(function (month, index) {
          return _react2.default.createElement(
            'option',
            { value: index, key: index },
            month
          );
        })
      )
    );
  },
  getYear: function getYear(componentId, field) {
    if (field.hide) {
      return null;
    }
    return this.getDatePart({
      key: 'year',
      componentId: componentId + '-year',
      title: 'Year',
      placeholder: field.placeholder,
      required: field.required,
      columns: 5,
      min: 0,
      max: 2100,
      characters: 4
    });
  },
  getSingleElement: function getSingleElement(value, index) {
    var component = this.props.component;

    return _react2.default.createElement(
      'div',
      { className: 'day-input' },
      _react2.default.createElement(
        'div',
        { className: 'daySelect form row' },
        component.dayFirst ? this.getDay(component.key, component.fields.day) : this.getMonth(component.key, component.fields.month),
        component.dayFirst ? this.getMonth(component.key, component.fields.month) : this.getDay(component.key, component.fields.day),
        this.getYear(component.key, component.fields.year)
      )
    );
  }
});