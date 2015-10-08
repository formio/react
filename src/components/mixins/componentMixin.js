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
  onFocus: function() {
    this.setState({
      isPristine: false
    });
  }
};