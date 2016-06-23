var React = require('react');
var Formiojs = require('formiojs');
var FormioComponent = require('./FormioComponent.jsx');
var _ = require('lodash');

require('./components');

module.exports = React.createClass({
  displayName: 'Formio',
  getInitialState: function() {
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
      isValid: true
    };
  },
  getDefaultProps: function() {
    return {
      readOnly: false,
      formAction: false
    };
  },
  componentWillMount: function() {
    this.data = this.data || {};
    this.inputs = {};
  },
  attachToForm: function(component) {
    this.inputs[component.props.component.key] = component;
    this.validate(component);
  },
  detachFromForm: function(component) {
    delete this.inputs[component.props.name];
    delete this.data[component.props.name];
  },
  onChange: function(component) {
    this.data[component.props.component.key] = component.state.value;
    this.validate(component);
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({data: this.data});
    }
  },
  validate: _.debounce(function(component) {
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
  validateForm: function() {
    var allIsValid = true;

    var inputs = this.inputs;
    Object.keys(inputs).forEach(function(name) {
      if (!inputs[name].state.isValid) {
        allIsValid = false;
      }
    });

    this.setState({
      isValid: allIsValid
    });
  },
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
          var re = new RegExp(component.props.component.validate.pattern, 'g');
          state.isValid = item.match(re);
          if (!state.isValid) {
            state.errorMessage = (component.props.component.label || component.props.component.key) + ' must match the expression: ' + component.props.component.validate.pattern;
          }
        }
        // Custom
        if (state.isValid && component.props.component.validate && component.props.component.validate.custom) {
          var custom = component.props.component.validate.custom;
          custom = custom.replace(/({{\s+(.*)\s+}})/, function(match, $1, $2) {
            return this.data[$2];
          }.bind(this));
          var input = item;
          /* jshint evil: true */
          var valid = eval(custom);
          state.isValid = (valid === true);
          if (!state.isValid) {
            state.errorMessage = valid || ((component.props.component.label || component.props.component.key) + 'is not a valid value.');
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
      this.formio = new Formiojs(this.props.src);
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
          this.data = _.clone(submission.data);
          this.setState({
            submission: submission
          }, this.validateForm);
        }.bind(this));
      }
    }
  },
  handleConditionalHideNShow: function(elementConditionalValue) {
  if (elementConditionalValue) {
      return true;
    } else {
      return false;
   }
  },
  checkConditional: function (component) {
    if (component.props.component.conditional && component.props.component.conditional.when) {
      var value = (this.data.hasOwnProperty(component.props.component.conditional.when) ? this.data[component.props.component.conditional.when] : '');
      return (value.toString() === component.props.component.conditional.eq.toString()) === (component.props.component.conditional.show.toString() === 'true');
    }
    else if (component.props.component.customConditional) {
      try {
        // Create a child block, and expose the submission data.
        var data = this.data; // eslint-disable-line no-unused-vars
        // Eval the custom conditional and update the show value.
        var show = eval('(function() { ' + component.props.component.customConditional.toString() + '; return show; })()');
        // Show by default, if an invalid type is given.
        return show.toString() === 'true';
      }
      catch (e) {
        return true;
      }
    }
    else {
      return true;
    }
  },
  showAlert: function(type, message) {
    this.setState(function(previousState) {
      previousState.alerts = previousState.alerts.concat({type: type, message: message});
      return previousState;
    });
  },
  onSubmit: function(event) {
    event.preventDefault();
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
          if (response.hasOwnProperty('name') && response.name === 'ValidationError') {
            response.details.forEach(function(detail) {
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
  resetForm: function() {
    this.setState(function(previousState) {
      for (var key in previousState.submission.data) {
        delete previousState.submission.data[key];
      }
      return previousState;
    });
  },
  render: function() {
    if (this.state.form.components) {
      this.componentNodes = this.state.form.components.map(function(component, index) {
        var value = (this.data && this.data.hasOwnProperty(component.key) ? this.data[component.key] : component.defaultValue || '');
        var key = component.key || component.type + index;
        return (
          <FormioComponent
            key={key}
            component={component}
            value={value}
            readOnly={this.props.readOnly}
            attachToForm={this.attachToForm}
            detachFromForm={this.detachFromForm}
            validate={this.validate}
            onChange={this.onChange}
            isSubmitting={this.state.isSubmitting}
            isFormValid={this.state.isValid}
            data={this.state.submission.data}
            onElementRender={this.props.onElementRender}
            resetForm={this.resetForm}
            formio={this.formio}
            showAlert={this.showAlert}
            checkConditional={this.checkConditional}
          />
        );
      }.bind(this));
    }
    var loading = (this.state.isLoading ? <i id='formio-loading' className='glyphicon glyphicon-refresh glyphicon-spin'></i> : '');
    var alerts = this.state.alerts.map(function(alert, index) {
        var className = 'alert alert-' + alert.type;
        return (<div className={className} role='alert' key={index}>{alert.message}</div>);
      });

    return (
      <form role='form' name='formioForm' onSubmit={this.onSubmit}>
        {loading}
        {alerts}
        {this.componentNodes}
      </form>
    );
  }
});
