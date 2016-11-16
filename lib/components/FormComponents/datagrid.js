'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _factories = require('../../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Datagrid',
  mixins: [_valueMixin2.default],
  getInitialValue: function getInitialValue() {
    return [{}];
  },
  getDefaultProps: function getDefaultProps() {
    return {
      checkConditional: function checkConditional() {
        return true;
      }
    };
  },
  addRow: function addRow() {
    if (this.props.readOnly) {
      return;
    }
    var rows = this.state.value;
    rows.push({});
    this.setState({
      value: rows
    });
    this.props.onChange(this);
  },
  removeRow: function removeRow(id) {
    if (this.props.readOnly) {
      return;
    }
    var rows = this.state.value;
    rows.splice(id, 1);
    this.setState({
      value: rows
    });
    this.props.onChange(this);
  },
  elementChange: function elementChange(row, component) {
    var value = this.state.value;
    value[row][component.props.component.key] = component.state.value;
    this.setValue(value);
  },
  getElements: function getElements() {
    var localKeys = this.props.component.components.map(function (component) {
      return component.key;
    });
    var classLabel = 'control-label' + (this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = this.props.component.label && !this.props.component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: this.props.component.key, className: classLabel },
      this.props.component.label
    ) : '';
    var headers = this.props.component.components.map(function (component, index) {
      if (this.props.checkConditional(component) || localKeys.indexOf(component.conditional.when) !== -1) {
        return _react2.default.createElement(
          'th',
          { key: index },
          component.label || ''
        );
      } else {
        return null;
      }
    }.bind(this));
    var tableClasses = 'table datagrid-table';
    tableClasses += this.props.component.striped ? ' table-striped' : '';
    tableClasses += this.props.component.bordered ? ' table-bordered' : '';
    tableClasses += this.props.component.hover ? ' table-hover' : '';
    tableClasses += this.props.component.condensed ? ' table-condensed' : '';

    return _react2.default.createElement(
      'div',
      { className: 'formio-data-grid' },
      _react2.default.createElement(
        'label',
        { className: classLabel },
        inputLabel
      ),
      _react2.default.createElement(
        'table',
        { className: tableClasses },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            headers
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          this.state.value.map(function (row, rowIndex) {
            return _react2.default.createElement(
              'tr',
              { key: rowIndex },
              this.props.component.components.map(function (component, index) {
                var key = component.key || component.type + index;
                var value = row.hasOwnProperty(component.key) ? row[component.key] : component.defaultValue || '';
                var FormioElement = _factories.FormioComponents.getComponent(component.type);
                if (this.props.checkConditional(component, row)) {
                  return _react2.default.createElement(
                    'td',
                    { key: key },
                    _react2.default.createElement(FormioElement, _extends({}, this.props, {
                      name: component.key,
                      component: component,
                      onChange: this.elementChange.bind(null, rowIndex),
                      value: value,
                      subData: _extends({}, row)
                    }))
                  );
                } else if (localKeys.indexOf(component.key)) {
                  return _react2.default.createElement('td', { key: key });
                } else {
                  return null;
                }
              }.bind(this)),
              _react2.default.createElement(
                'td',
                null,
                _react2.default.createElement(
                  'a',
                  { onClick: this.removeRow.bind(this, rowIndex), className: 'btn btn-default' },
                  _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove-circle' })
                )
              )
            );
          }.bind(this))
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'datagrid-add' },
        _react2.default.createElement(
          'a',
          { onClick: this.addRow, className: 'btn btn-primary' },
          _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement('i', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
            ' ',
            this.props.component.addAnother || 'Add Another'
          )
        )
      )
    );
  },
  getValueDisplay: function getValueDisplay(component, data) {
    var renderComponent = function renderComponent(component, row) {
      return _factories.FormioComponents.getComponent(component.type).prototype.getDisplay(component, row[component.key] || '');
    };
    return _react2.default.createElement(
      'table',
      { className: 'table table-striped table-bordered' },
      _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          component.components.map(function (component, index) {
            return _react2.default.createElement(
              'th',
              { key: index },
              component.label
            );
          })
        )
      ),
      _react2.default.createElement(
        'tbody',
        null,
        data.map(function (row, rowIndex) {
          return _react2.default.createElement(
            'tr',
            { key: rowIndex },
            component.components.map(function (subComponent, componentIndex) {
              return _react2.default.createElement(
                'td',
                { key: componentIndex },
                renderComponent(subComponent, row)
              );
            })
          );
        })
      )
    );
  }
});