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
          isOpen = _this2$props2.isOpen;


      if (isOpen) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'edit-body' },
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
        return _react2.default.createElement(Row, null);
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
        //}, () => console.log(this.state));
      }
    };

    _this3.setPristine = function (isPristine) {
      // Mark all inputs as dirty so errors show.
      Object.keys(_this3.inputs).forEach(function (name) {
        this.inputs[name].setState({
          isPristine: isPristine
        });
        if (typeof this.inputs[name].setPristine === 'function') {
          this.inputs[name].setPristine(isPristine);
        }
      }.bind(_this3));
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
        null,
        _react2.default.createElement(
          'div',
          { id: 'medModal', className: 'modal MedicationDialog', role: 'dialog', style: { display: 'block' } },
          _react2.default.createElement(
            'div',
            { className: 'modal-dialog' },
            _react2.default.createElement(
              'div',
              { className: 'modal-content' },
              _react2.default.createElement(
                'div',
                { className: 'scroll-modal-body modal-body' },
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
                  { className: 'modalActions' },
                  _react2.default.createElement(
                    'div',
                    { onClick: _this3.editDone, className: 'btn btn-primary btn-lg pull-right' },
                    'Save & Close'
                  ),
                  _react2.default.createElement(
                    'div',
                    { onClick: _this3.props.editDone.bind(null, null, rowIndex), className: 'btn btn-danger btn-lg pull-right' },
                    rowIndex !== null ? 'Remove' : 'Cancel'
                  ),
                  _react2.default.createElement('div', { className: 'clearfix' })
                )
              )
            )
          )
        ),
        _react2.default.createElement('div', { className: 'modal-backdrop' })
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
      previousState.isPristine = false;
      previousState.openRows.push(index);
      return previousState;
    }, function () {
      _this4.props.onChange(_this4);
    });
  },
  editRow: function editRow(id) {
    console.log('editRow', id);
    this.setState(function (previousState) {
      previousState.openRows.push(id);
      return previousState;
    });
  },
  editDone: function editDone(row, id) {
    var _this5 = this;

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
      previousState.openRows.splice(previousState.openRows.indexOf(id));
      return previousState;
    }, function () {
      _this5.props.onChange(_this5);
    });
  },
  removeRow: function removeRow(id) {
    var _this6 = this;

    if (this.props.readOnly) {
      return;
    }
    var rows = (0, _clone2.default)(this.state.value);
    this.props.onEvent('removeEditgridRow', this, id);
    rows.splice(id, 1);
    this.setState(function (previousState) {
      previousState.value = rows;
      previousState.isPristine = false;
      return previousState;
    }, function () {
      _this6.props.onChange(_this6);
    });
  },
  elementChange: function elementChange(row, component) {
    var _this7 = this;

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
      return _this7.props.onChange(component, { row: row, datagrid: _this7 });
    });
  },
  attachToDatarid: function attachToDatarid(row, component) {
    var _this8 = this;

    this.inputs = this.inputs || [];
    this.inputs[row] = this.inputs[row] || {};
    this.inputs[row][component.props.component.key] = component;
    this.setState(function (previousState) {
      return Object.assign(previousState, _this8.validate());
    }, function () {
      _this8.props.onChange(_this8);
    });
  },

  detachFromDatagrid: function detachFromDatagrid(row, component) {
    var _this9 = this;

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
      return Object.assign(previousState, _this9.validate());
    }, function () {
      _this9.props.onChange(_this9);
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
    var _this10 = this;

    var _state = this.state,
        value = _state.value,
        openEdit = _state.openEdit;
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

    var tableClasses = 'table datagrid-table';
    tableClasses += component.striped ? ' table-striped' : '';
    tableClasses += component.bordered ? ' table-bordered' : '';
    tableClasses += component.hover ? ' table-hover' : '';
    tableClasses += component.condensed ? ' table-condensed' : '';
    var btnClassNames = 'btn btn-primary' + (this.props.readOnly ? ' disabled' : '');

    return _react2.default.createElement(
      'div',
      { className: 'formio-data-grid' },
      _react2.default.createElement(
        'label',
        { className: classLabel },
        inputLabel
      ),
      _react2.default.createElement(
        'div',
        { className: tableClasses },
        _react2.default.createElement(Header, {
          value: value,
          component: component,
          checkConditional: checkConditional,
          visibleCols: visibleCols
        }),
        _react2.default.createElement(
          'div',
          { className: 'medListContainer' },
          value.map(function (row, rowIndex) {
            return _react2.default.createElement(EditGridRow, _extends({}, _this10.props, {
              component: component,
              row: row,
              rowIndex: rowIndex,
              removeRow: _this10.removeRow,
              editRow: _this10.editRow,
              editDone: _this10.editDone,
              isOpen: _this10.state.openRows.indexOf(rowIndex) !== -1
            }));
          })
        )
      ),
      !component.hasOwnProperty('validate') || !component.validate.hasOwnProperty('maxLength') || value.length < component.validate.maxLength ? _react2.default.createElement(
        'div',
        { className: 'datagrid-add' },
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