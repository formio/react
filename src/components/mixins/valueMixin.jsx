var React = require('react');

module.exports = {
  getInitialState: function() {
    var value = this.props.value;
    // Allow components to set different default values.
    if (!value) {
      if (typeof this.getInitialValue === 'function') {
        value = this.getInitialValue();
      }
      else {
        value = '';
      }
    }
    if ((this.props.component.type !== 'datagrid') && (this.props.component.type !== 'container')) {
      value = this.safeSingleToMultiple(value);
    }
    return {
      value: value,
      isValid: true,
      errorMessage: '',
      isPristine: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.value !== nextProps.value) {
      var value = this.safeSingleToMultiple(nextProps.value);
      this.setState({
        value: value
      });
    }
  },
  safeSingleToMultiple: function(value) {
    // If this was a single but is not a multivalue.
    if (this.props.component.multiple && !Array.isArray(value)) {
      value = [value];
    }
    // If this was a multivalue but is now single value.
    else if (!this.props.component.multiple && Array.isArray(value)) {
      value = value[0];
    }
    // Set dates to Date object.
    if (this.props.component.type === 'datetime' && value && !(value instanceof Date)) {
      value = new Date(value);
    }
    return value;
  },
  componentWillMount: function() {
    this.props.attachToForm(this);
  },
  componentWillUnmount: function() {
    this.props.detachFromForm(this);
  },
  onChange: function(event) {
    var value = event.currentTarget.value;
    // Allow components to respond to onChange event.
    if (typeof this.onChangeCustom === 'function') {
      value = this.onChangeCustom(value);
    }
    var index = (this.props.component.multiple ? event.currentTarget.getAttribute('data-index') : null);
    this.setValue(value, index);
  },
  setValue: function(value, index) {
    this.setState(function(previousState) {
      if (index) {
        previousState.value[index] = value;
      }
      else {
        previousState.value = value;
      }
      previousState.isPristine = false;
      return previousState;
    }, function() {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this);
      }
    }.bind(this));
  },
  getComponent: function() {
    var id = 'form-group-' + this.props.component.key;
    var classNames = 'form-group form-field-type-' + this.props.component.type + ' ' + id + (this.state.errorMessage !== '' && !this.state.isPristine ? ' has-error': '') + (this.props.component.customClass ? ' ' + this.props.component.customClass : '');
    var Elements = this.getElements();
    var Error = (this.state.errorMessage && !this.state.isPristine ? <p className='help-block'>{this.state.errorMessage}</p> : '');
    return (
      <div className={classNames} id={id}>
        {Elements}
        {Error}
      </div>
    );
  },
  render: function() {
    var element = this.getComponent();
    if (typeof this.props.onElementRender === 'function') {
      element = this.props.onElementRender(this, element);
    }
    return element;
  }
};
