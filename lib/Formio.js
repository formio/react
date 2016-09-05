'use strict';

var React = require('react');
var Formiojs = require('formiojs');
var FormioComponents = require('./FormioComponents');
var _ = require('lodash');

require('./components');

module.exports = React.createClass({
  displayName: 'Formio',
  getInitialState: function getInitialState() {
    if (this.props.submission && this.props.submission.data) {
      this.data = _.clone(this.props.submission.data);
    }
    return {
      form: this.props.form || {},
      submission: this.props.submission || {},
      submissions: this.props.submissions || [],
      alerts: [],
      isLoading: this.props.form ? false : true,
      isSubmitting: false,
      isValid: true
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      readOnly: false,
      formAction: false
    };
  },
  componentWillMount: function componentWillMount() {
    this.data = this.data || {};
    this.inputs = {};
  },
  attachToForm: function attachToForm(component) {
    this.inputs[component.props.component.key] = component;
    // Only add default values that are truthy.
    if (component.state.value) {
      this.data[component.props.component.key] = component.state.value;
    }
    this.validate(component);
  },
  detachFromForm: function detachFromForm(component) {
    delete this.inputs[component.props.name];
    delete this.data[component.props.component.key];
  },
  onChange: function onChange(component) {
    if (component.state.value === null) {
      delete this.data[component.props.component.key];
    } else {
      this.data[component.props.component.key] = component.state.value;
    }
    this.validate();
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ data: this.data }, component.props.component.key, component.state.value);
    }
  },
  validate: function validate() {
    var allIsValid = true;

    var inputs = this.inputs;
    Object.keys(inputs).forEach(function (name) {
      if (!inputs[name].state.isValid) {
        allIsValid = false;
      }
    });

    this.setState({
      isValid: allIsValid
    });
  },
  componentDidMount: function componentDidMount() {
    if (this.props.src) {
      this.formio = new Formiojs(this.props.src);
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
          this.data = _.clone(submission.data);
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
    if (component.conditional && component.conditional.when) {
      var value = this.data.hasOwnProperty(component.conditional.when) ? this.data[component.conditional.when] : '';
      return value.toString() === component.conditional.eq.toString() === (component.conditional.show.toString() === 'true');
    } else if (component.customConditional) {
      try {
        // Create a child block, and expose the submission data.
        var data = this.data; // eslint-disable-line no-unused-vars
        // Eval the custom conditional and update the show value.
        var show = eval('(function() { ' + component.customConditional.toString() + '; return show; })()');
        // Show by default, if an invalid type is given.
        return show.toString() === 'true';
      } catch (e) {
        return true;
      }
    } else {
      return true;
    }
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
  onSubmit: function onSubmit(event) {
    event.preventDefault();

    // Mark all inputs as dirty so errors show.
    Object.keys(this.inputs).forEach(function (name) {
      this.inputs[name].setState({
        isPristine: false
      });
    }.bind(this));

    if (!this.state.isValid) {
      this.showAlert('danger', 'Please fix the following errors before submitting.', true);
      return;
    }

    this.setState({
      alerts: [],
      isSubmitting: true
    });
    var sub = this.state.submission;
    sub.data = _.clone(this.data);

    var request;
    var method;
    // Do the submit here.
    if (this.state.form.action) {
      method = this.state.submission._id ? 'put' : 'post';
      request = Formiojs.request(this.state.form.action, method, sub);
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
    var loading = this.state.isLoading ? React.createElement('i', { id: 'formio-loading', className: 'glyphicon glyphicon-refresh glyphicon-spin' }) : '';
    var alerts = this.state.alerts.map(function (alert, index) {
      var className = 'alert alert-' + alert.type;
      return React.createElement(
        'div',
        { className: className, role: 'alert', key: index },
        alert.message
      );
    });

    return React.createElement(
      'form',
      { role: 'form', name: 'formioForm', onSubmit: this.onSubmit },
      loading,
      alerts,
      React.createElement(FormioComponents, {
        components: components,
        values: this.state.submission.data,
        readOnly: this.props.readOnly,
        attachToForm: this.attachToForm,
        detachFromForm: this.detachFromForm,
        isSubmitting: this.state.isSubmitting,
        isFormValid: this.state.isValid,
        onElementRender: this.props.onElementRender,
        resetForm: this.resetForm,
        formio: this.formio,
        onChange: this.onChange,
        checkConditional: this.checkConditional,
        showAlert: this.showAlert
      })
    );
  }
});