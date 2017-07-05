'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _valueMixin = require('react-formio/lib/components/FormComponents/mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _FormioComponentsList = require('../FormioComponentsList');

var _FormioComponentsList2 = _interopRequireDefault(_FormioComponentsList);

var _utils = require('formiojs/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderTemplate = function renderTemplate(template, data) {
  var actions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return function (_Component) {
    _inherits(_class2, _Component);

    function _class2() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args))), _this), _this.createMarkup = function () {
        return {
          __html: _utils2.default.interpolate(template, data)
        };
      }, _this.componentDidMount = function () {
        actions.forEach(function (action) {
          var elements = _this.element.getElementsByClassName(action.class);
          Array.prototype.forEach.call(elements, function (element) {
            element.addEventListener(action.event, action.action);
          });
        });
      }, _this.render = function () {
        return _react2.default.createElement('div', { dangerouslySetInnerHTML: _this.createMarkup(), ref: function ref(element) {
            return _this.element = element;
          } });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return _class2;
  }(_react.Component);
};

var EditGridRow = function (_Component2) {
  _inherits(EditGridRow, _Component2);

  function EditGridRow(props) {
    _classCallCheck(this, EditGridRow);

    var _this2 = _possibleConstructorReturn(this, (EditGridRow.__proto__ || Object.getPrototypeOf(EditGridRow)).call(this, props));

    _this2.componentWillReceiveProps = function (nextProps) {
      var components = _this2.props.components;
      // If one of the fields is set to refresh on a value outside the datagrid, check it as well.

      _this2.refresh = false;
      _utils2.default.eachComponent(components, function (component) {
        if ('refreshOn' in component && component.refreshOn) {
          var refreshOn = component.refreshOn;

          if (refreshOn === 'data') {
            _this2.refresh = true;
          }
          if (!_this2.data.hasOwnProperty(refreshOn) && nextProps.hasOwnProperty(refreshOn) || _this2.data[refreshOn] !== nextProps.data[refreshOn]) {
            _this2.refresh = true;
          }
        }
      });
      _this2.data = Object.assign({}, nextProps.data);
    };

    _this2.shouldComponentUpdate = function (nextProps) {
      var _this2$props = _this2.props,
          row = _this2$props.row,
          isOpen = _this2$props.isOpen;


      if (!(0, _isEqual2.default)(row, nextProps.row)) {
        return true;
      }

      if (isOpen !== nextProps.isOpen) {
        return true;
      }

      return _this2.refresh;
    };

    _this2.render = function () {
      var _this2$props2 = _this2.props,
          component = _this2$props2.component,
          rowIndex = _this2$props2.rowIndex,
          row = _this2$props2.row,
          isOpen = _this2$props2.isOpen,
          validation = _this2$props2.validation;


      if (isOpen) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'edit-body ' + component.rowClass },
            _react2.default.createElement(RowEdit, _this2.props)
          )
        );
      } else {
        var data = {
          row: row,
          rowIndex: rowIndex,
          components: component.components

        };
        var actions = [{
          class: 'removeRow',
          event: 'click',
          action: _this2.props.removeRow.bind(null, rowIndex)
        }, {
          class: 'editRow',
          event: 'click',
          action: _this2.props.editRow.bind(null, rowIndex)
        }];
        var Row = renderTemplate(component.templates.row, data, actions);
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Row, null),
          validation && !validation.isValid ? _react2.default.createElement(
            'div',
            { className: validation.errorType + '-error' },
            validation.errorMessage
          ) : null
        );
      }
    };

    _this2.data = Object.assign({}, props.data);
    _this2.refresh = false;
    return _this2;
  }

  return EditGridRow;
}(_react.Component);

var RowEdit = function (_React$Component) {
  _inherits(RowEdit, _React$Component);

  function RowEdit(props) {
    _classCallCheck(this, RowEdit);

    var _this3 = _possibleConstructorReturn(this, (RowEdit.__proto__ || Object.getPrototypeOf(RowEdit)).call(this, props));

    _this3.componentWillMount = function () {
      _this3.props.onEvent('editGridOpen', _this3.props.rowIndex);
      _this3.unmounting = false;
    };

    _this3.componentWillUnmount = function () {
      _this3.props.onEvent('editGridClose', _this3.props.rowIndex);
      _this3.unmounting = true;
    };

    _this3.attachToForm = function (component) {
      _this3.inputs = _this3.inputs || {};
      _this3.inputs[component.props.component.key] = component;
    };

    _this3.detachFromForm = function (component) {
      if (_this3.unmounting) {
        return;
      }
      var value = _this3.state.value;

      if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
        if (component.props.component.key && value && value.hasOwnProperty(component.props.component.key)) {
          _this3.setState(function (previousState) {
            delete previousState[component.props.component.key];
            return previousState;
          });
        }
      }
      delete _this3.inputs[component.props.component.key];
    };

    _this3.elementChange = function (component) {
      if (component.props.component.key) {
        _this3.setState(function (previousState) {
          var value = (0, _clone2.default)(previousState.value);
          value[component.props.component.key] = component.state.value;
          previousState.value = value;
          // If a component isn't pristine, the container isn't pristine.
          if (!component.state.isPristine && previousState.isPristine) {
            previousState.isPristine = false;
          }
          return previousState;
        });
      }
    };

    _this3.setPristine = function (isPristine) {
      // Mark all inputs as dirty so errors show.
      Object.keys(_this3.inputs).forEach(function (name) {
        _this3.inputs[name].setState({
          isPristine: isPristine
        });
        if (typeof _this3.inputs[name].setPristine === 'function') {
          _this3.inputs[name].setPristine(isPristine);
        }
      });
      _this3.setState({
        isPristine: isPristine
      });
    };

    _this3.editDone = function () {
      _this3.setPristine(false);

      // Check all inputs to make sure they are valid.
      var isValid = true;
      Object.keys(_this3.inputs).forEach(function (name) {
        if (!_this3.inputs[name].state.isValid) {
          isValid = false;
        }
      });

      if (isValid) {
        _this3.props.editDone(_this3.state.value, _this3.props.rowIndex);
      }
    };

    _this3.render = function () {
      var _this3$props = _this3.props,
          component = _this3$props.component,
          rowIndex = _this3$props.rowIndex;

      return _react2.default.createElement(
        'div',
        { className: 'editgrid-edit' },
        _react2.default.createElement(
          'div',
          { className: 'editgrid-body' },
          _react2.default.createElement(_FormioComponentsList2.default, _extends({}, _this3.props, {
            components: component.components,
            values: _this3.state.value,
            row: _this3.state.value,
            rowIndex: rowIndex,
            onChange: _this3.elementChange,
            attachToForm: _this3.attachToForm,
            detachFromForm: _this3.detachFromForm
          })),
          _react2.default.createElement(
            'div',
            { className: 'editgrid-actions' },
            _react2.default.createElement(
              'div',
              { onClick: _this3.editDone, className: 'btn btn-primary btn-lg pull-right' },
              component.saveRow || 'Save'
            ),
            component.removeRow ? _react2.default.createElement(
              'div',
              { onClick: _this3.props.editDone.bind(null, null, rowIndex), className: 'btn btn-danger btn-lg pull-right' },
              component.removeRow || 'Cancel'
            ) : null
          )
        )
      );
    };

    _this3.state = {
      value: props.row || {}
    };
    return _this3;
  }

  return RowEdit;
}(_react2.default.Component);

exports.default = _react2.default.createClass({
  displayName: 'EditGrid',
  mixins: [_valueMixin2.default],
  getInitialValue: function getInitialValue() {
    return [];
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
    state.value = rows || [];
    state.openRows = [];
    state.rowsValid = [];
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
    var _this4 = this;

    if (this.props.readOnly) {
      return;
    }
    // Allow addRow override.
    var component = this.props.component;

    if (component.Edit) {
      return this.setState({
        openEdit: {
          id: null,
          row: {}
        }
      });
    }
    var rows = (0, _clone2.default)(this.state.value);
    var index = rows.length;
    this.props.onEvent('addEditgridRow', this);
    rows.push({});
    this.setState(function (previousState) {
      previousState.value = rows;
      previousState.isPristine = true;
      previousState.openRows.push(index);
      Object.assign(previousState, _this4.validateCustom(null, previousState));
      return previousState;
    }, function () {
      _this4.props.onChange(_this4);
    });
  },
  editRow: function editRow(id) {
    var _this5 = this;

    this.setState(function (previousState) {
      previousState.openRows.push(id);
      Object.assign(previousState, _this5.validateCustom(null, previousState));
      return previousState;
    }, function () {
      _this5.props.onChange(_this5);
    });
  },
  editDone: function editDone(row, id) {
    var _this6 = this;

    var value = (0, _clone2.default)(this.state.value);
    // If no id, this is an add.
    if (id === null && row) {
      this.props.onEvent('addEditgridRow', this);
      value.push(row);
    } else if (id !== null && row === null) {
      this.props.onEvent('removeEditgridRow', this, id);
      value.splice(id, 1);
    } else if (id !== null && row) {
      value[id] = row;
    }
    this.setState(function (previousState) {
      previousState.value = value;
      previousState.isPristine = false;
      previousState.openRows.splice(previousState.openRows.indexOf(id), 1);
      Object.assign(previousState, _this6.validateCustom(null, previousState));
      return previousState;
    }, function () {
      _this6.props.onChange(_this6);
    });
  },
  removeRow: function removeRow(id) {
    var _this7 = this;

    if (this.props.readOnly) {
      return;
    }
    var rows = (0, _clone2.default)(this.state.value);
    this.props.onEvent('removeEditgridRow', this, id);
    rows.splice(id, 1);
    this.setState(function (previousState) {
      previousState.value = rows;
      previousState.isPristine = false;
      Object.assign(previousState, _this7.validateCustom(null, previousState));
      return previousState;
    }, function () {
      _this7.props.onChange(_this7);
    });
  },
  validateCustom: function validateCustom(value, state) {
    var isValid = true,
        errorType = '',
        errorMessage = '';
    var myState = state || this.state;
    if (myState) {
      if (myState.openRows.length) {
        isValid = false;
        errorType = 'editgrid';
        errorMessage = 'Please save all rows before proceeding.';
      }
      var rowsValid = this.validateRows(myState.value);
      if (!rowsValid.allRowsValid) {
        isValid = false;
        errorMessage = 'Please correct rows before proceeding.';
        errorType = 'editgrid-row';
      }
    }
    return {
      isValid: isValid,
      errorType: errorType,
      errorMessage: errorMessage
    };
  },
  validateRows: function validateRows(values) {
    var _this8 = this;

    var component = this.props.component;

    var allRowsValid = true;
    var rowsValid = values.map(function (value) {
      var state = {
        isValid: true,
        errorType: '',
        errorMessage: ''
      };
      var custom = component.validate.row;
      custom = custom.replace(/({{\s+(.*)\s+}})/, function (match, $1, $2) {
        return value[$2];
      }.bind(_this8));
      var valid = void 0;
      try {
        var row = value;
        var data = _this8.props.data;

        valid = eval(custom);
        state.isValid = valid === true;
      } catch (e) {
        /* eslint-disable no-console, no-undef */
        console.warn('A syntax error occurred while computing custom values in ' + component.key, e);
        /* eslint-enable no-console */
      }
      if (!state.isValid) {
        state.errorType = 'custom';
        state.errorMessage = valid;
      }
      allRowsValid = allRowsValid && state.isValid;
      return state;
    });
    rowsValid.allRowsValid = allRowsValid;
    return rowsValid;
  },
  getElements: function getElements() {
    var _this9 = this;

    var _state = this.state,
        value = _state.value,
        openRows = _state.openRows;

    var rowsValid = this.validateRows(value);
    var _props = this.props,
        component = _props.component,
        checkConditional = _props.checkConditional;

    var Header = renderTemplate(component.templates.header, {
      components: component.components,
      value: value
    });

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

    var tableClasses = 'editgrid-listgroup list-group';
    tableClasses += component.striped ? ' table-striped' : '';
    tableClasses += component.bordered ? ' table-bordered' : '';
    tableClasses += component.hover ? ' table-hover' : '';
    tableClasses += component.condensed ? ' table-condensed' : '';
    var btnClassNames = 'btn btn-primary' + (this.props.readOnly ? ' disabled' : '');

    return _react2.default.createElement(
      'div',
      { className: 'formio-edit-grid' },
      _react2.default.createElement(
        'label',
        { className: classLabel },
        inputLabel
      ),
      _react2.default.createElement(
        'ul',
        { className: tableClasses },
        _react2.default.createElement(Header, {
          value: value,
          component: component,
          checkConditional: checkConditional,
          visibleCols: visibleCols
        }),
        _react2.default.createElement(
          'li',
          { className: 'editgrid-rows list-group-items' },
          value.map(function (row, rowIndex) {
            return _react2.default.createElement(EditGridRow, _extends({}, _this9.props, {
              key: rowIndex,
              component: component,
              row: row,
              rowIndex: rowIndex,
              removeRow: _this9.removeRow,
              editRow: _this9.editRow,
              editDone: _this9.editDone,
              isOpen: openRows.indexOf(rowIndex) !== -1,
              validation: rowsValid[rowIndex]
            }));
          })
        )
      ),
      !component.hasOwnProperty('validate') || !component.validate.hasOwnProperty('maxLength') || value.length < component.validate.maxLength ? _react2.default.createElement(
        'div',
        { className: 'editgrid-add' },
        _react2.default.createElement(
          'a',
          { onClick: this.addRow, className: btnClassNames },
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
  }
});