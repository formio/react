import React from 'react';
import Formiojs from 'formiojs';
import FormioUtils from 'formio-utils';
import { FormioComponentsList } from '../components';
import _ from 'lodash';

// TODO: We should have a better way of initializing form components.
import '../components/FormComponents';

export const Formio = React.createClass({
  displayName: 'Formio',
  getInitialState: function () {
    this.unmounting = false;
    if (this.props.submission && this.props.submission.data) {
      this.data = _.clone(this.props.submission.data);
    }
    return {
      form: this.props.form || {},
      submission: this.props.submission || {},
      submissions: this.props.submissions || [],
      alerts: [],
      isLoading: (this.props.form ? false : true),
      isSubmitting: false,
      isValid: true,
      isPristine: true
    };
  },
  getDefaultProps: function () {
    return {
      readOnly: false,
      formAction: false,
      options: {}
    };
  },
  componentWillMount: function () {
    this.data = this.data || {};
    this.inputs = {};
  },
  componentWillUnmount: function() {
    this.unmounting = true;
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.form !== this.props.form) {
      this.setState({
        form: nextProps.form
      });
    }
    if (nextProps.submission !== this.props.submission) {
      if (nextProps.submission && nextProps.submission.data) {
        this.data = _.clone(nextProps.submission.data);
      }
      this.setState({
        submission: nextProps.submission
      });
    }
  },
  attachToForm: function (component) {
    this.inputs[component.props.component.key] = component;
    this.validate(component);
  },
  detachFromForm: function (component) {
    // Don't detach when the whole form is unmounting.
    if (this.unmounting) {
      return;
    }
    delete this.inputs[component.props.name];
    if (this.data && this.data.hasOwnProperty(component.props.component.key)) {
      delete this.data[component.props.component.key];
      // Fire the onchange again as it may have fired before we remove the value.
      if (typeof this.props.onChange === 'function' && !component.state.isPristine) {
        this.props.onChange({data: this.data}, component.props.component.key, null);
      }
    }
  },
  onEvent: function(event) {
    if (typeof this.props.onEvent === 'function') {
      this.props.onEvent(event, this.data);
    }
  },
  onChange: function (component) {
    if (component.state.value === null) {
      delete this.data[component.props.component.key];
    }
    else {
      this.data[component.props.component.key] = component.state.value;
    }
    this.validate();
    if (typeof this.props.onChange === 'function' && !component.state.isPristine) {
      this.props.onChange({data: this.data}, component.props.component.key, component.state.value);
    }
    // If a field is no longer pristine, the form is no longer pristine.
    if (!component.state.isPristine && this.state.isPristine) {
      this.setState({
        isPristine: false
      });
    }
  },
  validate: function () {
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
  componentDidMount: function () {
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
    }
    else if (this.props.form) {
      this.validate();
    }
  },
  checkConditional: function (component, row = {}) {
    const show = FormioUtils.checkCondition(component, row, this.data);
    // If element is hidden, remove any values already on the form (this can happen when data is loaded into the form
    // and the field is initially hidden.
    if (!show) {
      if (this.data.hasOwnProperty(component.key)) {
        delete this.data[component.key];
      }
    }
    return show;
  },
  isDisabled: function(component, data) {
    return this.props.readOnly || (Array.isArray(this.props.disableComponents) && this.props.disableComponents.indexOf(component.key) !== -1) || component.disabled;
  },
  showAlert: function (type, message, clear) {
    this.setState(function (previousState) {
      if (clear) {
        previousState.alerts = [];
      }
      previousState.alerts = previousState.alerts.concat({type: type, message: message});
      return previousState;
    });
  },
  setPristine: function(isPristine) {
    // Mark all inputs as dirty so errors show.
    Object.keys(this.inputs).forEach(function (name) {
      this.inputs[name].setState({
        isPristine
      });
    }.bind(this));
    this.setState({
      isPristine
    });
  },
  onSubmit: function (event) {
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
    sub.data = _.clone(this.data);

    var request;
    var method;
    // Do the submit here.
    if (this.state.form.action) {
      method = this.state.submission._id ? 'put' : 'post';
      request = Formiojs.request(this.state.form.action, method, sub);
    }
    else if (this.formio) {
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
              message: 'Submission was ' + ((method === 'put') ? 'updated' : 'created')
            }]
          });
        }.bind(this))
        .catch(function (response) {
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
          }
          else {
            this.showAlert('danger', response);
          }
        }.bind(this));
    }
    else {
      if (typeof this.props.onFormSubmit === 'function') {
        this.props.onFormSubmit(sub);
      }
      this.setState({
        alerts: [],
        isSubmitting: false
      });
    }
  },
  resetForm: function () {
    this.setState(function (previousState) {
      for (var key in previousState.submission.data) {
        delete previousState.submission.data[key];
      }
      return previousState;
    });
  },
  render: function () {
    var components = this.state.form.components || [];
    var loading = (this.state.isLoading ?
      <i id='formio-loading' className='glyphicon glyphicon-refresh glyphicon-spin'></i> : '');
    var alerts = this.state.alerts.map(function (alert, index) {
      var className = 'alert alert-' + alert.type;
      return (<div className={className} role='alert' key={index}>{alert.message}</div>);
    });

    return (
      <form role='form' name='formioForm' onSubmit={this.onSubmit}>
        {loading}
        {alerts}
        <FormioComponentsList
          components={components}
          values={this.data}
          options={this.props.options}
          attachToForm={this.attachToForm}
          detachFromForm={this.detachFromForm}
          isSubmitting={this.state.isSubmitting}
          isFormValid={this.state.isValid}
          onElementRender={this.props.onElementRender}
          resetForm={this.resetForm}
          formio={this.formio}
          data={this.data}
          onChange={this.onChange}
          onEvent={this.onEvent}
          isDisabled={this.isDisabled}
          checkConditional={this.checkConditional}
          showAlert={this.showAlert}
          formPristine={this.state.isPristine}
          unmounting={this.unmounting}
        />
      </form>
    );
  }
});
