'use strict'

module.exports = React.createClass({
  displayName: 'FormioComponent',
  render: function() {
    // FormioComponents is a global variable so external scripts can define custom components.
    var FormioElement = FormioComponents[this.props.component.type];
    return (
      <div className="form-group has-feedback form-field-type-{{ component.type }}" ng-class="{\'has-error\': formioFieldForm[component.key].$invalid && !formioFieldForm[component.key].$pristine }">
        <FormioElement
          component={this.props.component}
          name={this.props.component.key}
          value={this.props.value}
          readOnly={this.props.readOnly}
          attachToForm={this.props.attachToForm}
          detachFromForm={this.props.detachFromForm}
          isSubmitting={this.props.isSubmitting}
          isFormValid={this.props.isFormValid}
          validate={this.props.validate}
          />
      </div>
    );
  }
});