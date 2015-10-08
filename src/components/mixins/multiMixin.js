'use strict'

module.exports = {
  addFieldValue: function() {
    var values = this.state.value;
    values.push(this.props.component.defaultValue);
    this.setState({
      value: values
    });
  },
  removeFieldValue: function(id) {
    var values = this.state.value;
    values.splice(id, 1);
    this.setState({
      value: values
    });
  },
  getElements: function() {
    var Component;
    var classLabel = "control-label" + ( this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ? <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate.required ? <span className="glyphicon glyphicon-asterisk form-control-feedback field-required-inline" aria-hidden="true"></span> : '');
    var className = (this.props.component.prefix || this.props.component.suffix ? 'input-group' : '');
    var prefix = (this.props.component.prefix ? <div className="input-group-addon">{this.props.component.prefix}</div> : '');
    var suffix = (this.props.component.suffix ? <div className="input-group-addon">{this.props.component.suffix}</div> : '');
    var data = this.state.value;
    if (this.props.component.multiple) {
      // If this was a single value but is now a multivalue.
      if (!Array.isArray(data)) {
        data = [data];
      }
      var rows = data.map(function(value, id) {
        var Element = this.getSingleElement(value);
        return (
          <tr key={id}>
            <td>{requiredInline}
              <div className={className}>
                {prefix} {Element} {suffix}
              </div>
            </td>
            <td><a onClick={this.removeFieldValue.bind(null, id)} className="btn btn-danger"><span className="glyphicon glyphicon-remove-circle"></span></a></td>
          </tr>
        );
      }.bind(this));
      Component =
        <table className="table table-bordered">
          {inputLabel}
          <tbody>
            {rows}
            <tr>
              <td colSpan="2"><a onClick={this.addFieldValue} className="btn btn-primary"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add another</a></td>
            </tr>
          </tbody>
        </table>;
    }
    else {
      // If this was a multivalue but is now single value.
      if (Array.isArray(data)) {
        data = data[0];
      }
      var Element = this.getSingleElement(data);
      Component =
        <div>
          {inputLabel} {requiredInline}
          <div className={className}>
            {prefix} {Element} {suffix}
          </div>
        </div>
    }
    return Component;
  }
};