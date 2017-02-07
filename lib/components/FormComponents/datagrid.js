'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

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
  setPristine: function setPristine(isPristine) {
    if (this.inputs) {
      this.inputs.forEach(function (row) {
        Object.keys(row).forEach(function (key) {
          row[key].setState({
            isPristine: isPristine
          });
        });
      });
    }
  },
  getDefaultProps: function getDefaultProps() {
    return {
      checkConditional: function checkConditional() {
        return true;
      },
      isDisabled: function isDisabled() {
        return false;
      }
    };
  },
  addRow: function addRow() {
    var _this = this;

    if (this.props.readOnly) {
      return;
    }
    var rows = (0, _lodash.clone)(this.state.value);
    rows.push({});
    this.setState(function (previousState) {
      previousState.value = rows;
      previousState.isPristine = false;
      return previousState;
    }, function () {
      _this.props.onChange(_this);
    });
  },
  removeRow: function removeRow(id) {
    var _this2 = this;

    if (this.props.readOnly) {
      return;
    }
    var rows = (0, _lodash.clone)(this.state.value);
    rows.splice(id, 1);
    this.setState(function (previousState) {
      previousState.value = rows;
      previousState.isPristine = false;
      return previousState;
    }, function () {
      _this2.props.onChange(_this2);
    });
  },
  elementChange: function elementChange(row, component) {
    var _this3 = this;

    var isValid = this.validateCustom();
    this.setState(function (previousState) {
      // Clone to keep state immutable.
      var value = (0, _lodash.clone)(previousState.value);
      value[row] = (0, _lodash.clone)(value[row]);
      value[row][component.props.component.key] = component.state.value;
      previousState.value = value;
      previousState.isValid = isValid.isValid;
      // If a component isn't pristine, the datagrid isn't pristine.
      if (!component.state.isPristine && previousState.isPristine) {
        previousState.isPristine = false;
      }
      return previousState;
    }, function () {
      return _this3.props.onChange(component, { row: row, datagrid: _this3 });
    });
  },
  attachToForm: function attachToForm(row, component) {
    this.inputs = this.inputs || [];
    this.inputs[row] = this.inputs[row] || {};
    this.inputs[row][component.props.component.key] = component;
    this.props.onChange(this);
  },

  detachFromForm: function detachFromForm(row, component) {
    if (this.unmounting) {
      return;
    }
    var value = (0, _lodash.clone)(this.state.value);
    if (component.props.component.key && value[row] && value[row].hasOwnProperty(component.props.component.key)) {
      delete value[row][component.props.component.key];
      this.setValue(value);
    }
    delete this.inputs[row][component.props.component.key];
    if (Object.keys(this.inputs[row]).length === 0) {
      delete this.inputs[row];
    }
    this.props.onChange(this);
  },
  validateCustom: function validateCustom() {
    var isValid = true;
    // If any inputs are false, the datagrid is false.
    if (this.inputs) {
      this.inputs.forEach(function (row) {
        Object.keys(row).forEach(function (key) {
          if (row[key].state.isValid === false) {
            isValid = false;
          }
        });
      });
    }
    return {
      isValid: isValid,
      errorMessage: ''
    };
  },
  getElements: function getElements() {
    var value = this.state.value;
    var _props = this.props,
        component = _props.component,
        checkConditional = _props.checkConditional;

    var visibleCols = component.components.reduce(function (prev, col) {
      prev[col.key] = value.reduce(function (prev, row) {
        return prev || checkConditional(col, row);
      }, false);
      return prev;
    }, {});
    var classLabel = 'control-label' + (this.props.component.validate && component.validate.required ? ' field-required' : '');
    var inputLabel = component.label && !component.hideLabel ? _react2.default.createElement(
      'label',
      { htmlFor: component.key, className: classLabel },
      component.label
    ) : '';
    var headers = component.components.map(function (col, index) {
      if (visibleCols[col.key]) {
        //if (this.props.checkConditional(col) || localKeys.indexOf(col.conditional.when) !== -1 || !!col.customConditional) {
        var colLabel = 'control-label' + (col.validate && col.validate.required ? ' field-required' : '');
        return _react2.default.createElement(
          'th',
          { key: index },
          _react2.default.createElement(
            'label',
            { className: colLabel },
            col.label || ''
          )
        );
      } else {
        return null;
      }
    }.bind(this));
    var tableClasses = 'table datagrid-table';
    tableClasses += component.striped ? ' table-striped' : '';
    tableClasses += component.bordered ? ' table-bordered' : '';
    tableClasses += component.hover ? ' table-hover' : '';
    tableClasses += component.condensed ? ' table-condensed' : '';

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
              component.components.map(function (col, index) {
                var key = col.key || col.type + index;
                var value = row.hasOwnProperty(col.key) ? row[col.key] : col.defaultValue || '';
                var FormioElement = _factories.FormioComponents.getComponent(col.type);
                if (checkConditional(col, row)) {
                  return _react2.default.createElement(
                    'td',
                    { key: key },
                    _react2.default.createElement(FormioElement, _extends({}, this.props, {
                      readOnly: this.props.isDisabled(col),
                      name: col.key,
                      component: col,
                      onChange: this.elementChange.bind(null, rowIndex),
                      attachToForm: this.attachToForm.bind(null, rowIndex),
                      detachFromForm: this.detachFromForm.bind(null, rowIndex),
                      value: value,
                      row: row,
                      values: row
                    }))
                  );
                } else if (visibleCols[col.key]) {
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
            component.addAnother || 'Add Another'
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