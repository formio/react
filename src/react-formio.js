'use strict'

var formiojs = require('formiojs')();
var FormioComponent = require('./react-formio-component');

require('./components');

module.exports = React.createClass({
  displayName: 'Formio',
  getInitialState: function() {
    return {
      form: this.props.form || {},
      submission: this.props.submission || {},
      submissions: this.props.submissions || [],
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
  validate: function(component) {
    var isValid = true;
    var errorMessage = '';

    if (component.state.value || component.props.component.validate.required) {
      if (component.state.value && component.state.value.length) {
        // MaxLength
        if (isValid && component.props.component.validate.maxLength && component.state.value.length > component.props.component.validate.maxLength) {
          isValid = false;
          errorMessage = (component.props.component.label || component.props.component.key) + ' must be shorter than ' + (component.props.component.validate.maxLength + 1) + ' characters';
        }
        // MinLength
        if (isValid && component.props.component.validate.minLength && component.state.value.length < component.props.component.validate.minLength) {
          isValid =  false;
          errorMessage = (component.props.component.label || component.props.component.key) + ' must be longer than ' + (component.props.component.validate.minLength - 1) + ' characters';
        }
        // Regex
        if (isValid && component.props.component.validate.pattern) {
          var re = new RegExp(component.props.component.validate.pattern, "g");
          isValid = component.state.value.match(re);
          if (!isValid) {
            errorMessage = (component.props.component.label || component.props.component.key) + ' must match the expression: ' + component.props.component.validate.pattern;
          }
        }
        // Custom
        if (isValid && component.props.component.validate.custom) {
          var custom = component.props.component.validate.custom;
          custom = custom.replace(/({{\s+(.*)\s+}})/, function(match, $1, $2) {
            // TODO: need to ensure this.data has up to date values.
            return this.data[$2];
          });
          /* jshint evil: true */
          var valid = eval(custom);
          isValid = (valid === true);
          if (!isValid) {
            errorMessage = valid || ((component.props.component.label || component.props.component.key) + "is not a valid value.");
          }
        }
      }
      // Only gets here if required but no value.
      else {
        isValid: false;
        errorMessage = (component.props.component.label || component.props.component.key) + ' is required.';
      }
    }
    component.setState({
      isValid: isValid,
      errorMessage: errorMessage
    }, this.validateForm);
  },
  componentDidMount: function() {
    if (this.props.src) {
      this.formio = new formiojs(this.props.src);
      this.formio.loadForm().then(function(form) {
        this.setState({
          form: form
        });
      }.bind(this));
      if (this.formio.submissionId) {
        this.formio.loadSubmission().then(function(submission) {
          this.setState({
            submission: submission
          })
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
  onSubmit: function (event) {
    event.preventDefault();
    this.setState({
      isSubmitting: true
    });
    this.updateData();
    var sub = this.state.submission;
    sub.data = this.data;

    // Do the submit here.
    this.formio.saveSubmission(sub).then(function(submission) {
      this.setState({
        submission: submission,
        isSubmitting: false
      });
    }.bind(this));
  },
  render: function() {
    if (this.state.form.components) {
      this.componentNodes = this.state.form.components.map(function(component) {
        var value = (this.state.submission.data && this.state.submission.data.hasOwnProperty(component.key) ? this.state.submission.data[component.key] : component.defaultValue || '');
        return (
          <FormioComponent
            key={component.key}
            component={component}
            value={value}
            readOnly={this.props.readOnly}
            attachToForm={this.attachToForm}
            detachFromForm={this.detachFromForm}
            validate={this.validate}
            isSubmitting={this.state.isSubmitting}
            isFormValid={this.state.isValid}
          />
        );
      }.bind(this));
    }
    var loading = <i id="formio-loading" className="glyphicon glyphicon-refresh glyphicon-spin"></i>;
    return (
      <form role="form" name="formioForm" onSubmit={this.onSubmit}>
        <div ng-repeat="alert in formioAlerts" className="alert" role="alert">
        </div>
        {this.componentNodes}
      </form>
    );
  }
});
