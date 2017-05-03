'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Formio = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formiojs = require('formiojs');

var _formiojs2 = _interopRequireDefault(_formiojs);

var _formioUtils = require('formio-utils');

var _formioUtils2 = _interopRequireDefault(_formioUtils);

var _components = require('../components');

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

require('../components/FormComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// TODO: We should have a better way of initializing form components.


var Formio = exports.Formio = _react2.default.createClass({
  displayName: 'Formio',
  getInitialState: function getInitialState() {
    this.unmounting = false;
    if (this.props.submission && this.props.submission.data) {
      this.data = (0, _clone2.default)(this.props.submission.data);
    }
    return {
      form: this.props.form || {},
      submission: this.props.submission || {},
      submissions: this.props.submissions || [],
      alerts: [],
      isLoading: this.props.form ? false : true,
      isSubmitting: false,
      isValid: true,
      isPristine: true
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      readOnly: false,
      formAction: false,
      options: {}
    };
  },
  componentWillMount: function componentWillMount() {
    if (this.props.submission && this.props.submission.data) {
      this.data = (0, _clone2.default)(this.props.submission.data);
    } else {
      this.data = {};
    }
    this.inputs = {};
    if (this.props.src) {
      this.formio = new _formiojs2.default(this.props.src);
      this.formio.loadForm().then(function (form) {
        if (typeof this.props.onFormLoad === 'function') {
          this.props.onFormLoad(form);
        }
        this.setState({
          form: form,
          isLoading: false
        }, this.validate);
      }.bind(this));
      if (this.formio.submissionId) {
        this.formio.loadSubmission().then(function (submission) {
          if (typeof this.props.onSubmissionLoad === 'function') {
            this.props.onSubmissionLoad(submission);
          }
          this.data = (0, _clone2.default)(submission.data);
          this.setState({
            submission: submission
          }, this.validate);
        }.bind(this));
      }
    } else if (this.props.form) {
      this.validate();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.unmounting = true;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.form !== this.props.form) {
      this.setState({
        form: nextProps.form
      });
    }
    if (nextProps.submission !== this.props.submission) {
      if (nextProps.submission && nextProps.submission.data) {
        this.data = (0, _clone2.default)(nextProps.submission.data);
      }
      this.setState({
        submission: nextProps.submission
      });
    }
  },
  attachToForm: function attachToForm(component) {
    this.inputs[component.props.component.key] = component;
    this.validate();
  },
  detachFromForm: function detachFromForm(component) {
    var _this = this;

    var sendChange = false;
    // Don't detach when the whole form is unmounting.
    if (this.unmounting) {
      return;
    }
    delete this.inputs[component.props.component.key];
    if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
      if (this.data && this.data.hasOwnProperty(component.props.component.key)) {
        delete this.data[component.props.component.key];
        sendChange = true;
      }
    }
    this.validate(function () {
      if (sendChange && typeof _this.props.onChange === 'function') {
        _this.props.onChange({ data: _this.data }, component);
      }
    });
  },
  onEvent: function onEvent(event) {
    if (typeof this.props.onEvent === 'function') {
      this.props.onEvent.apply(null, [event, this.data].concat(_toConsumableArray(Array.prototype.slice.call(arguments, 1, arguments.length))));
    }
  },
  onChange: function onChange(component) {
    var _this2 = this;

    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // Datagrids and containers are different.
    if (context.hasOwnProperty('datagrid')) {
      this.data[context.datagrid.props.component.key] = context.datagrid.state.value;
    } else if (context.hasOwnProperty('container')) {
      this.data[context.container.props.component.key] = context.container.state.value;
    } else {
      if (component.state.value === null) {
        delete this.data[component.props.component.key];
      } else {
        this.data[component.props.component.key] = component.state.value;
      }
    }
    this.validate(function () {
      if (typeof _this2.props.onChange === 'function') {
        _this2.props.onChange({ data: _this2.data }, component, context);
      }
    });
    // If a field is no longer pristine, the form is no longer pristine.
    if (!component.state.isPristine && this.state.isPristine) {
      this.setState({
        isPristine: false
      });
    }
  },
  validate: function validate(next) {
    var allIsValid = true;

    var inputs = this.inputs;
    Object.keys(inputs).forEach(function (name) {
      if (!inputs[name].state.isValid) {
        allIsValid = false;
      }
    });

    this.setState(function (previousState) {
      return previousState.isValid = allIsValid;
    }, next);

    return allIsValid;
  },
  clearHiddenData: function clearHiddenData(component) {
    var _this3 = this;

    if (!component.hasOwnProperty('clearOnHide') || component.clearOnHide !== false) {
      if (this.data.hasOwnProperty(component.key)) {
        delete this.data[component.key];
        if (typeof this.props.onChange === 'function') {
          // Since this component isn't mounted, we need to fake the component's props and state.
          this.props.onChange({ data: this.data }, { props: { component: component }, state: { isPristine: true, value: null } });
        }
      }
    }
    if (component.hasOwnProperty('components')) {
      component.components.forEach(function (component) {
        _this3.clearHiddenData(component);
      });
    }
    if (component.hasOwnProperty('columns')) {
      component.columns.forEach(function (column) {
        column.components.forEach(function (component) {
          _this3.clearHiddenData(component);
        });
      });
    }
    if (component.hasOwnProperty('rows') && Array.isArray(component.rows)) {
      component.rows.forEach(function (column) {
        column.forEach(function (component) {
          _this3.clearHiddenData(component);
        });
      });
    }
  },
  checkConditional: function checkConditional(component) {
    var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var show = _formioUtils2.default.checkCondition(component, row, this.data);

    // If element is hidden, remove any values already on the form (this can happen when data is loaded into the form
    // and the field is initially hidden.
    if (!show) {
      // Recursively delete data for all components under this component.
      this.clearHiddenData(component);
    }

    return show;
  },
  isDisabled: function isDisabled(component, data) {
    return this.props.readOnly || Array.isArray(this.props.disableComponents) && this.props.disableComponents.indexOf(component.key) !== -1 || component.disabled;
  },
  showAlert: function showAlert(type, message, clear) {
    this.setState(function (previousState) {
      if (clear) {
        previousState.alerts = [];
      }
      previousState.alerts = previousState.alerts.concat({ type: type, message: message });
      return previousState;
    });
  },
  setPristine: function setPristine(isPristine) {
    // Mark all inputs as dirty so errors show.
    Object.keys(this.inputs).forEach(function (name) {
      this.inputs[name].setState({
        isPristine: isPristine
      });
      if (typeof this.inputs[name].setPristine === 'function') {
        this.inputs[name].setPristine(isPristine);
      }
    }.bind(this));
    this.setState({
      isPristine: isPristine
    });
  },
  onSubmit: function onSubmit(event) {
    event.preventDefault();

    this.setPristine(false);

    if (!this.state.isValid) {
      this.showAlert('danger', 'Please fix the following errors before submitting.', true);
      return;
    }

    this.setState({
      alerts: [],
      isSubmitting: true
    });
    var sub = this.state.submission;
    sub.data = (0, _clone2.default)(this.data);

    var request;
    var method;
    // Do the submit here.
    if (this.state.form.action) {
      method = this.state.submission._id ? 'put' : 'post';
      request = _formiojs2.default.request(this.state.form.action, method, sub);
    } else if (this.formio) {
      request = this.formio.saveSubmission(sub);
    }
    if (request) {
      request.then(function (submission) {
        if (typeof this.props.onFormSubmit === 'function') {
          this.props.onFormSubmit(submission);
        }
        this.setState({
          isSubmitting: false,
          alerts: [{
            type: 'success',
            message: 'Submission was ' + (method === 'put' ? 'updated' : 'created')
          }]
        });
      }.bind(this)).catch(function (response) {
        if (typeof this.props.onFormError === 'function') {
          this.props.onFormError(response);
        }
        this.setState({
          isSubmitting: false
        });
        if (response.hasOwnProperty('name') && response.name === 'ValidationError') {
          response.details.forEach(function (detail) {
            if (this.inputs[detail.path]) {
              this.inputs[detail.path].setState({
                isValid: false,
                isPristine: false,
                errorMessage: detail.message
              });
            }
          }.bind(this));
        } else {
          this.showAlert('danger', response);
        }
      }.bind(this));
    } else {
      if (typeof this.props.onFormSubmit === 'function') {
        this.props.onFormSubmit(sub);
      }
      this.setState({
        alerts: [],
        isSubmitting: false
      });
    }
  },
  resetForm: function resetForm() {
    this.setState(function (previousState) {
      for (var key in previousState.submission.data) {
        delete previousState.submission.data[key];
      }
      return previousState;
    });
  },
  render: function render() {
    var components = this.state.form.components || [];
    var loading = this.state.isLoading ? _react2.default.createElement('i', { id: 'formio-loading', className: 'glyphicon glyphicon-refresh glyphicon-spin' }) : '';
    var alerts = this.state.alerts.map(function (alert, index) {
      var className = 'alert alert-' + alert.type;
      return _react2.default.createElement(
        'div',
        { className: className, role: 'alert', key: index },
        alert.message
      );
    });

    return _react2.default.createElement(
      'form',
      { role: 'form', name: 'formioForm', onSubmit: this.onSubmit },
      loading,
      alerts,
      _react2.default.createElement(_components.FormioComponentsList, {
        components: components,
        values: this.data,
        options: this.props.options,
        attachToForm: this.attachToForm,
        detachFromForm: this.detachFromForm,
        isSubmitting: this.state.isSubmitting,
        isFormValid: this.state.isValid,
        onElementRender: this.props.onElementRender,
        resetForm: this.resetForm,
        formio: this.formio,
        data: this.data,
        onChange: this.onChange,
        onEvent: this.onEvent,
        isDisabled: this.isDisabled,
        checkConditional: this.checkConditional,
        showAlert: this.showAlert,
        formPristine: this.state.isPristine
      })
    );
  }
});