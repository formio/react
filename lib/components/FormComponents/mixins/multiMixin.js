'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  addFieldValue: function addFieldValue() {
    var _this = this;

    var value = (0, _get2.default)(this.state.value);
    value.push(this.props.component.defaultValue);
    this.setState(function (previousState) {
      previousState.isPristine = false;
      previousState.value = value;
      return previousState;
    }, function () {
      if (typeof _this.props.onChange === 'function') {
        _this.props.onChange(_this);
      }
    });
  },
  removeFieldValue: function removeFieldValue(id) {
    var _this2 = this;

    var value = (0, _get2.default)(this.state.value);
    value.splice(id, 1);
    this.setState(function (previousState) {
      previousState.isPristine = false;
      previousState.value = value;
      return previousState;
    }, function () {
      if (typeof _this2.props.onChange === 'function') {
        _this2.props.onChange(_this2);
      }
    });
  },
  getElements: function getElements() {
    var component = this.props.component;

    var Component;
    var classLabel = 'control-label' + (component.validate && component.validate.required ? ' field-required' : '');
    var inputLabel = component.label && !component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: component.key, className: classLabel },
      component.label
    ) : '';
    var requiredInline = (component.hideLabel === true || component.label === '' || !component.label) && component.validate && component.validate.required ? _react2.default.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';
    var prefix = component.prefix ? _react2.default.createElement(
      'div',
      { className: 'input-group-addon' },
      component.prefix
    ) : '';
    var suffix = component.suffix ? _react2.default.createElement(
      'div',
      { className: 'input-group-addon' },
      component.suffix
    ) : '';
    var data = this.state.value;
    if (component.multiple) {
      var rows = data.map(function (value, id) {
        var Element = this.getSingleElement(value, id);
        return _react2.default.createElement(
          'tr',
          { key: id },
          _react2.default.createElement(
            'td',
            null,
            _react2.default.createElement(
              'div',
              { className: 'input-group' },
              prefix,
              ' ',
              Element,
              ' ',
              requiredInline,
              ' ',
              suffix
            )
          ),
          _react2.default.createElement(
            'td',
            null,
            _react2.default.createElement(
              'a',
              { onClick: this.removeFieldValue.bind(null, id), className: 'btn btn-danger remove-row remove-row-' + id },
              _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove-circle' })
            )
          )
        );
      }.bind(this));
      Component = _react2.default.createElement(
        'div',
        { className: 'formio-component-multiple' },
        inputLabel,
        _react2.default.createElement(
          'table',
          { className: 'table table-bordered' },
          _react2.default.createElement(
            'tbody',
            null,
            rows,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'td',
                { colSpan: '2' },
                _react2.default.createElement(
                  'a',
                  { onClick: this.addFieldValue, className: 'btn btn-primary add-row' },
                  _react2.default.createElement('span', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
                  ' Add another'
                )
              )
            )
          )
        )
      );
    } else {
      var Element = this.getSingleElement(data);
      Component = _react2.default.createElement(
        'div',
        { className: 'formio-component-single' },
        inputLabel,
        _react2.default.createElement(
          'div',
          { className: 'input-group' },
          prefix,
          ' ',
          Element,
          ' ',
          requiredInline,
          ' ',
          suffix
        )
      );
    }
    return Component;
  }
};