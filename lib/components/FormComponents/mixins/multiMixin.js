'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  addFieldValue: function addFieldValue() {
    var values = this.state.value;
    values.push(this.props.component.defaultValue);
    this.setState({
      value: values
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this);
    }
  },
  removeFieldValue: function removeFieldValue(id) {
    var values = this.state.value;
    values.splice(id, 1);
    this.setState({
      value: values
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this);
    }
  },
  getElements: function getElements() {
    var Component;
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var requiredInline = !this.props.component.label && this.props.component.validate && this.props.component.validate.required ? _react2.default.createElement('span', { className: 'glyphicon glyphicon-asterisk form-control-feedback field-required-inline', 'aria-hidden': 'true' }) : '';
    var prefix = this.props.component.prefix ? _react2.default.createElement(
      'div',
      { className: 'input-group-addon' },
      this.props.component.prefix
    ) : '';
    var suffix = this.props.component.suffix ? _react2.default.createElement(
      'div',
      { className: 'input-group-addon' },
      this.props.component.suffix
    ) : '';
    var data = this.state.value;
    if (this.props.component.multiple) {
      var rows = data.map(function (value, id) {
        var Element = this.getSingleElement(value, id);
        return _react2.default.createElement(
          'tr',
          { key: id },
          _react2.default.createElement(
            'td',
            null,
            requiredInline,
            _react2.default.createElement(
              'div',
              { className: 'input-group' },
              prefix,
              ' ',
              Element,
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
        ' ',
        requiredInline,
        _react2.default.createElement(
          'div',
          { className: 'input-group' },
          prefix,
          ' ',
          Element,
          ' ',
          suffix
        )
      );
    }
    return Component;
  }
};