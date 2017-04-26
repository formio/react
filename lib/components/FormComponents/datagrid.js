'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _factories = require('../../factories');

var _formioUtils = require('formio-utils');

var _formioUtils2 = _interopRequireDefault(_formioUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataGridRow = function (_React$Component) {
  _inherits(DataGridRow, _React$Component);

  function DataGridRow(props) {
    _classCallCheck(this, DataGridRow);

    var _this = _possibleConstructorReturn(this, (DataGridRow.__proto__ || Object.getPrototypeOf(DataGridRow)).call(this, props));

    _this.componentWillReceiveProps = function (nextProps) {
      var components = _this.props.components;
      // If one of the fields is set to refresh on a value outside the datagrid, check it as well.

      _this.refresh = false;
      _formioUtils2.default.eachComponent(components, function (component) {
        if ('refreshOn' in component && component.refreshOn) {
          var refreshOn = component.refreshOn;

          if (refreshOn === 'data') {
            _this.refresh = true;
          }
          if (!_this.data.hasOwnProperty(refreshOn) && nextProps.hasOwnProperty(refreshOn) || _this.data[refreshOn] !== nextProps.data[refreshOn]) {
            _this.refresh = true;
          }
        }
      });
      _this.data = _extends({}, nextProps.data);
    };

    _this.shouldComponentUpdate = function (nextProps) {
      var row = _this.props.row;


      if (!(0, _isEqual2.default)(row, nextProps.row)) {
        return true;
      }

      return _this.refresh;
    };

    _this.render = function () {
      var _this$props = _this.props,
          component = _this$props.component,
          rowIndex = _this$props.rowIndex,
          row = _this$props.row,
          checkConditional = _this$props.checkConditional,
          visibleCols = _this$props.visibleCols;

      var datagridValue = _this.state && 'value' in _this.state ? _this.state.value : [];

      return _react2.default.createElement(
        'tr',
        null,
        component.components.map(function (col, index) {
          var key = col.key || col.type + index;
          var value = row.hasOwnProperty(col.key) ? row[col.key] : col.defaultValue || null;
          var FormioElement = _factories.FormioComponents.getComponent(col.type);
          if (checkConditional(col, row)) {
            return _react2.default.createElement(
              'td',
              { key: key },
              _react2.default.createElement(FormioElement, _extends({}, _this.props, {
                readOnly: _this.props.isDisabled(col),
                name: col.key,
                component: col,
                onChange: _this.props.elementChange.bind(null, rowIndex),
                attachToForm: _this.props.attachToDatarid.bind(null, rowIndex),
                detachFromForm: _this.props.detachFromDatagrid.bind(null, rowIndex),
                value: value,
                row: row,
                rowIndex: rowIndex,
                values: row
              }))
            );
          } else if (visibleCols[col.key]) {
            return _react2.default.createElement('td', { key: key });
          } else {
            return null;
          }
        }),
        !component.hasOwnProperty('validate') || !component.validate.hasOwnProperty('minLength') || datagridValue.length > component.validate.minLength ? _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement(
            'a',
            { onClick: _this.props.removeRow.bind(null, rowIndex), className: 'btn btn-default' },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove-circle' })
          )
        ) : null
      );
    };

    _this.data = _extends({}, props.data);
    _this.refresh = false;
    return _this;
  }

  return DataGridRow;
}(_react2.default.Component);

module.exports = _react2.default.createClass({
  displayName: 'Datagrid',
  mixins: [_valueMixin2.default],
  getInitialValue: function getInitialValue() {
    return [{}];
  },
  customState: function customState(state) {
    var component = this.props.component;

    var rows = state.value;
    if (component.validate && component.validate.hasOwnProperty('minLength') && rows.length < component.validate.minLength) {
      var toAdd = component.validate.minLength - rows.length;
      for (var i = 0; i < toAdd; i++) {
        rows.push({});
      }
    }
    // If more than maxLength, remove extra rows.
    if (component.validate && component.validate.hasOwnProperty('maxLength') && rows.length < component.validate.maxLength) {
      rows = rows.slice(0, component.validate.maxLength);
    }
    state.value = rows;
    return state;
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
    var _this2 = this;

    if (this.props.readOnly) {
      return;
    }
    var rows = (0, _clone2.default)(this.state.value);
    rows.push({});
    this.setState(function (previousState) {
      previousState.value = rows;
      previousState.isPristine = false;
      return previousState;
    }, function () {
      _this2.props.onChange(_this2);
    });
  },
  removeRow: function removeRow(id) {
    var _this3 = this;

    if (this.props.readOnly) {
      return;
    }
    var rows = (0, _clone2.default)(this.state.value);
    rows.splice(id, 1);
    this.setState(function (previousState) {
      previousState.value = rows;
      previousState.isPristine = false;
      return previousState;
    }, function () {
      _this3.props.onChange(_this3);
    });
  },
  elementChange: function elementChange(row, component) {
    var _this4 = this;

    var isValid = this.validateCustom();
    this.setState(function (previousState) {
      // Clone to keep state immutable.
      var value = (0, _clone2.default)(previousState.value);
      value[row] = (0, _clone2.default)(value[row]);
      value[row][component.props.component.key] = component.state.value;
      previousState.value = value;
      previousState.isValid = isValid.isValid;
      // If a component isn't pristine, the datagrid isn't pristine.
      if (!component.state.isPristine && previousState.isPristine) {
        previousState.isPristine = false;
      }
      return previousState;
    }, function () {
      return _this4.props.onChange(component, { row: row, datagrid: _this4 });
    });
  },
  attachToDatarid: function attachToDatarid(row, component) {
    var _this5 = this;

    this.inputs = this.inputs || [];
    this.inputs[row] = this.inputs[row] || {};
    this.inputs[row][component.props.component.key] = component;
    this.setState(function (previousState) {
      return Object.assign(previousState, _this5.validate());
    }, function () {
      _this5.props.onChange(_this5);
    });
  },

  detachFromDatagrid: function detachFromDatagrid(row, component) {
    var _this6 = this;

    if (this.unmounting) {
      return;
    }
    var value = (0, _clone2.default)(this.state.value);
    if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
      if (component.props.component.key && value[row] && value[row].hasOwnProperty(component.props.component.key)) {
        delete value[row][component.props.component.key];
        this.setValue(value);
      }
    }
    delete this.inputs[row][component.props.component.key];
    if (Object.keys(this.inputs[row]).length === 0) {
      delete this.inputs[row];
    }
    this.setState(function (previousState) {
      return Object.assign(previousState, _this6.validate());
    }, function () {
      _this6.props.onChange(_this6);
    });
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
      errorType: '',
      errorMessage: ''
    };
  },
  getElements: function getElements() {
    var _this7 = this;

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
    var headerVisible = false;
    var headers = component.components.map(function (col, index) {
      if (visibleCols[col.key]) {
        var colLabel = 'control-label' + (col.validate && col.validate.required ? ' field-required' : '');
        if (col.label) {
          headerVisible = true;
        }
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
    });
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
        headerVisible ? _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            headers
          )
        ) : null,
        _react2.default.createElement(
          'tbody',
          null,
          value.map(function (row, rowIndex) {
            return _react2.default.createElement(DataGridRow, _extends({
              elementChange: _this7.elementChange,
              attachToDatarid: _this7.attachToDatarid,
              detachFromDatagrid: _this7.detachFromDatagrid,
              removeRow: _this7.removeRow,
              visibleCols: visibleCols,
              row: row,
              rowIndex: rowIndex,
              key: rowIndex
            }, _this7.props));
          })
        )
      ),
      !component.hasOwnProperty('validate') || !component.validate.hasOwnProperty('maxLength') || value.length < component.validate.maxLength ? _react2.default.createElement(
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
      ) : null
    );
  },
  getValueDisplay: function getValueDisplay(component, data) {
    var renderComponent = function renderComponent(component, row) {
      return _factories.FormioComponents.getComponent(component.type).prototype.getDisplay(component, row[component.key] || null);
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