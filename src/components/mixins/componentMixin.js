'use strict'

module.exports = {
  getInitialState: function () {
    return {
      value: this.props.value || '',
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
    this.setState({
      value: event.currentTarget.value,
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
        {Elements}
        {Error}
      </div>
    );
  },
  render: function() {
    return this.getComponent();
  }
};