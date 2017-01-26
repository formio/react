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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('../components/FormComponents');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Formio = exports.Formio = _react2.default.createClass({
  displayName: 'Formio',
  getInitialState: function getInitialState() {
    this.unmounting = false;
    if (this.props.submission && this.props.submission.data) {
      this.data = _lodash2.default.clone(this.props.submission.data);
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
    this.data = this.data || {};
    this.inputs = {};
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
        this.data = _lodash2.default.clone(nextProps.submission.data);
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

    // Don't detach when the whole form is unmounting.
    if (this.unmounting) {
      return;
    }
    delete this.inputs[component.props.component.key];
    if (this.data && this.data.hasOwnProperty(component.props.component.key)) {
      delete this.data[component.props.component.key];
      this.validate(function () {
        if (typeof _this.props.onChange === 'function') {
          _this.props.onChange({ data: _this.data }, component.props.component.key, null);
        }
      });
    }
  },
  onEvent: function onEvent(event) {
    if (typeof this.props.onEvent === 'function') {
      this.props.onEvent(event, this.data);
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
  componentDidMount: function componentDidMount() {
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
          this.data = _lodash2.default.clone(submission.data);
          this.setState({
            submission: submission
          }, this.validate);
        }.bind(this));
      }
    } else if (this.props.form) {
      this.validate();
    }
  },
  checkConditional: function checkConditional(component) {
    var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var show = _formioUtils2.default.checkCondition(component, row, this.data);
    // If element is hidden, remove any values already on the form (this can happen when data is loaded into the form
    // and the field is initially hidden.
    if (!show) {
      if (this.data.hasOwnProperty(component.key)) {
        delete this.data[component.key];
      }
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
    sub.data = _lodash2.default.clone(this.data);

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

// TODO: We should have a better way of initializing form components.