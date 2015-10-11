'use strict'

var React = require('react');

module.exports = {
  getInitialState: function () {
    var value = this.props.value || '';
    // If this was a single value but is now a multivalue.
    if (this.props.component.multiple && !Array.isArray(value)) {
      value = [value];
    }
    // If this was a multivalue but is now single value.
    else if (!this.props.component.multiple && Array.isArray(value)) {
      value = value[0];
    }
    return {
      value: value,
      isValid: true,
      errorMessage: '',
      isPristine: true
    };
  },
  componentWillMount: function () {
    this.props.attachToForm(this);
  },
  componentWillUnmount: function () {
    this.props.detachFromForm(this);
  },
  setValue: function (event) {
    var value = this.state.value;
    var attribute = 'value';
    if (this.props.component.type === 'checkbox') {
      attribute = 'checked';
    }
    if (this.props.component.multiple) {
      var index = event.currentTarget.getAttribute('data-index');
      value[index] = event.currentTarget[attribute];
    }
    else {
      value = event.currentTarget[attribute];
    }
    this.setState({
      value: value,
      isPristine: false
    }, function() {
      if (typeof this.props.validate === 'function') {
        this.props.validate(this)
      }
    }.bind(this));
  },
  getComponent: function() {
    var classNames = "form-group has-feedback form-field-type-" + this.props.component.type + (this.state.errorMessage !== '' && !this.state.isPristine ? ' has-error': '');
    var id = "form-group-" + this.props.component.key;
    var Elements = this.getElements();
    var Error = (this.state.errorMessage && !this.state.isPristine ? <p className="help-block">{this.state.errorMessage}</p> : '');
    return (
      <div className={classNames} id={id}>
        <div>
          {Elements}
        </div>
        {Error}
      </div>
    );
  },
  render: function() {
    return this.getComponent();
  }
};