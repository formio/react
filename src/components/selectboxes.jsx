var React = require('react');
var valueMixin = require('./mixins/valueMixin');

module.exports = React.createClass({
  displayName: 'SelectBox',
  mixins: [valueMixin],
  getInitialValue: function() {
    return {};
  },
  onChangeCheckbox: function(key, e) {
    var value = this.state.value;
    value[key] = e.currentTarget.checked;
    this.setValue(value);
  },
  getElements: function() {
    var classLabel = 'control-label' + ( this.props.component.validate && this.props.component.validate.required ? ' field-required' : '');
    var inputLabel = (this.props.component.label && !this.props.component.hideLabel ?
      <label htmlFor={this.props.component.key} className={classLabel}>{this.props.component.label}</label> : '');
    var requiredInline = (!this.props.component.label && this.props.component.validate && this.props.component.validate.required ?
      <span className='glyphicon glyphicon-asterisk form-control-feedback field-required-inline'
            aria-hidden='true'></span> : '');
    var required = (this.props.component.validate.required ? 'field-required' : '');
    return (
      <div>
        {inputLabel} {requiredInline}
        <div className="selectbox">
          {this.props.component.values.map(function(item, index) {
            return (
              <div className="checkbox" key={index}>
                <label className={required}>
                  <input
                    type="checkbox"
                    key={this.props.component.key}
                    name={this.props.name}
                    checked={this.state.value[item.value] || ''}
                    onChange={this.onChangeCheckbox.bind(null, item.value)}
                  />{item.label}
                </label>
              </div>
            );
          }.bind(this))}
        </div>
      </div>
    );
  }
});
