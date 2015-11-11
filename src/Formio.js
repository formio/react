'use strict'

var React = require('react');
var formiojs = require('formiojs')();
var FormioComponent = require('./FormioComponent');

require('./components');

var debounce = function (func, threshold, execAsap) {
  var timeout;
  return function debounced () {
    var obj = this, args = arguments;
    function delayed () {
      if (!execAsap)
        func.apply(obj, args);
      timeout = null;
    };
    if (timeout)
      clearTimeout(timeout);
    else if (execAsap)
      func.apply(obj, args);

    timeout = setTimeout(delayed, threshold || 100);
  };
};

module.exports = React.createClass({
  displayName: 'Formio',
  getInitialState: function() {
    return {
      form: this.props.form || {},
      submission: this.props.submission || {},
      submissions: this.props.submissions || [],
      alerts: [],
      isLoading: (this.props.form ? false : true),
      isSubmitting: false,
      isValid: true
    };
  },
  getDefaultProps: function() {
    return {
      readOnly: false,
      formAction: false
    };
  },
  componentWillMount: function () {
    this.data = {};
    this.inputs = {};
  },
  attachToForm: function (component) {
    this.inputs[component.props.component.key] = component;
    this.data[component.props.component.key] = component.state.value;
    this.validate(component);
  },
  detachFromForm: function (component) {
    delete this.inputs[component.props.name];
    delete this.data[component.props.name];
  },
  validate: debounce(function(component) {
    var state = {
      isValid: true,
      errorMessage: ''
    };
    // Validate each item if multiple.
    if (component.props.component.multiple) {
      component.state.value.forEach(function(item, index) {
        if (state.isValid) {
          state = this.validateItem(item, component);
        }
      }.bind(this));
    }
    else {
      state = this.validateItem(component.state.value, component);
    }
    component.setState(state, this.validateForm);
  }, 500),
  validateItem: function(item, component) {
    var state = {
      isValid: true,
      errorMessage: ''
    };
    if (item || (component.props.component.validate && component.props.component.validate.required)) {
      if (item) {
        if (state.isValid && component.props.component.type === 'email' && !item.match(/\S+@\S+/)) {
          state.isValid = false;
          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be a valid email.';
        }
        // MaxLength
        if (state.isValid && component.props.component.validate && component.props.component.validate.maxLength && item.length > component.props.component.validate.maxLength) {
          state.isValid = false;
          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be shorter than ' + (component.props.component.validate.maxLength + 1) + ' characters';
        }
        // MinLength
        if (state.isValid && component.props.component.validate && component.props.component.validate.minLength && item.length < component.props.component.validate.minLength) {
          state.isValid =  false;
          state.errorMessage = (component.props.component.label || component.props.component.key) + ' must be longer than ' + (component.props.component.validate.minLength - 1) + ' characters';
        }
        // Regex
        if (state.isValid && component.props.component.validate && component.props.component.validate.pattern) {
          var re = new RegExp(component.props.component.validate.pattern, "g");
          state.isValid = item.match(re);
          if (!state.isValid) {
            state.errorMessage = (component.props.component.label || component.props.component.key) + ' must match the expression: ' + component.props.component.validate.pattern;
          }
        }
        // Custom
        if (state.isValid && component.props.component.validate && component.props.component.validate.custom) {
          var custom = component.props.component.validate.custom;
          this.updateData();
          custom = custom.replace(/({{\s+(.*)\s+}})/, function(match, $1, $2) {
            return this.data[$2];
          }.bind(this));
          var input = item;
          /* jshint evil: true */
          var valid = eval(custom);
          state.isValid = (valid === true);
          if (!state.isValid) {
            state.errorMessage = valid || ((component.props.component.label || component.props.component.key) + "is not a valid value.");
          }
        }
      }
      // Only gets here if required but no value.
      else {
        state.isValid = false;
        state.errorMessage = (component.props.component.label || component.props.component.key) + ' is required.';
      }
    }
    return state;
  },
  componentDidMount: function() {
    if (this.props.src) {
      this.formio = new formiojs(this.props.src);
      this.formio.loadForm().then(function(form) {
        if (typeof this.props.onFormLoad === 'function') {
          this.props.onFormLoad(form);
        }
        this.setState({
          form: form,
          isLoading: false
        }, this.validateForm);
      }.bind(this));
      if (this.formio.submissionId) {
        this.formio.loadSubmission().then(function(submission) {
          if (typeof this.props.onSubmissionLoad === 'function') {
            this.props.onSubmissionLoad(submission);
          }
          this.setState({
            submission: submission
          }, this.validateForm)
        }.bind(this));
      }
    }
  },
  updateData: function(component) {
    Object.keys(this.inputs).forEach(function (name) {
      this.data[name] = this.inputs[name].state.value;
    }.bind(this));
  },
  validateForm: function () {
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
  showAlert: function(type, message) {
    this.setState(function(previousState) {
      previousState.alerts = previousState.alerts.concat({type: type, message: message});
      return previousState;
    })
  },
  onSubmit: function (event) {
    event.preventDefault();
    this.setState({
      alerts: [],
      isSubmitting: true
    });
    this.updateData();
    var sub = this.state.submission;
    sub.data = this.data;

    var request;
    var method;
    // Do the submit here.
    if (this.state.form.action) {
      method = this.state.submission._id ? 'put' : 'post';
      request = formiojs.request(this.state.form.action, method, sub);
    }
    else {
      request = this.formio.saveSubmission(sub);
    }
    request.then(function(submission) {
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
    .catch(function(response) {
      if (typeof this.props.onFormError === 'function') {
        this.props.onFormError(response);
      }
      this.setState({
        isSubmitting: false
      });
      if (response.hasOwnProperty('name') && response.name === "ValidationError") {
        response.details.forEach(function (detail) {
          if (this.inputs[detail.path]) {
            this.inputs[detail.path].setState({
              isValid: false,
              isPristine: false,
              errorMessage: detail.message
            })
          }
        }.bind(this));
      }
      else {
        this.showAlert('danger', response);
      }
    }.bind(this));
  },
  resetForm() {
    this.setState(function(previousState) {
      for(var key in previousState.submission.data) {
        delete previousState.submission.data[key];
      }
      return previousState;
    });
  },
  render: function() {
    if (this.state.form.components) {
      this.componentNodes = this.state.form.components.map(function(component) {
        var value = (this.state.submission.data && this.state.submission.data.hasOwnProperty(component.key) ? this.state.submission.data[component.key] : component.defaultValue || '');
        var key = component.key || component.type;
        return (
          <FormioComponent
            key={key}
            component={component}
            value={value}
            readOnly={this.props.readOnly}
            attachToForm={this.attachToForm}
            detachFromForm={this.detachFromForm}
            validate={this.validate}
            isSubmitting={this.state.isSubmitting}
            isFormValid={this.state.isValid}
            data={this.state.submission.data}
            onElementRender={this.props.onElementRender}
            resetForm={this.resetForm}
            formio={this.formio}
            showAlert={this.showAlert}
          />
        );
      }.bind(this));
    }
    var loading = (this.state.isLoading ? <i id="formio-loading" className="glyphicon glyphicon-refresh glyphicon-spin"></i> : '');
    var alerts = this.state.alerts.map(function(alert, index) {
        var className = "alert alert-" + alert.type;
        return (<div className={className} role="alert" key={index}>{alert.message}</div>);
      });


    return (
      <form role="form" name="formioForm" onSubmit={this.onSubmit}>
        {loading}
        {alerts}
        {this.componentNodes}
      </form>
    );
  }
});
