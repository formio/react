var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Checkbox',
  mixins: [valueMixin, multiMixin],
  onChangeCheckbox: function(event) {
    var value = event.currentTarget.checked;
    var index = (this.props.component.multiple ? event.currentTarget.getAttribute('data-index') : null);
    this.setValue(value, index);
  },
  getSingleElement: function(value, index) {
    index = index || 0;
    var required = "control-label" + (this.props.component.validate.required ? ' field-required' : '') + (value ? ' checked' : ' not-checked');
    return (
      <div className="checkbox">
        <label className={required}>
          <input
            type="checkbox"
            id={this.props.component.key}
            data-index={index}
            name={this.props.name}
            checked={value}
            disabled={this.props.readOnly}
            onChange={this.onChangeCheckbox}
          />{this.props.component.label}
        </label>
      </div>
    );
  }
});
