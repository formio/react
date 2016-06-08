'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
    displayName: 'Currency',
    mixins: [componentMixin, multiMixin],
    updateCharacterChange: function(e) {
        var regexToValidateNumber = '^\[0-9]*\,?(([.0-9][^.]{0,2}))$';
        var regexForNumber = '^[0-9]*$';
        var withOutCommaString = e.target.value.replace(RegExp(',', 'g'), '');

        if (((e.target.value.charAt(e.target.value.length-1).match(regexForNumber)) || (e.target.value.charAt(e.target.value.length-1) == '.'))
            && ((withOutCommaString.match(regexToValidateNumber) || e.target.value == ""))) {
                this.setState({value: withOutCommaString.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,")});
        }
    },
    getSingleElement: function(value, index) {
        return(
            <input
                type="text"
                className="form-control"
                id={this.props.component.key}
                data-index={index}
                name={this.props.name}
                value={this.state.value}
                placeholder={this.props.component.placeholder}
                min={this.props.component.validate.min}
                max={this.props.component.validate.max}
                step={this.props.component.validate.step}
                onChange={this.updateCharacterChange}
            />
        );
    }
});
