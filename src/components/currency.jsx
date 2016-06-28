var React = require('react');
var valueMixin = require('./mixins/valueMixin.jsx');
var multiMixin = require('./mixins/multiMixin.jsx');
var inputMixin = require('./mixins/inputMixin.jsx');

valueMixin.onChange =  function(e) {
    var regexToValidateNumber = '^\[0-9]*\,?(([.0-9][^.]{0,2}))$';
    var regexForNumber = '^[0-9]*$';
    var regexToRemoveComma = new RegExp(',', 'g');
    var withOutCommaString = e.target.value.replace(regexToRemoveComma, '');

    if (e.target.value.charAt(e.target.value.length-1).match(regexForNumber) || e.target.value.charAt(e.target.value.length-1) === '.') {
        if (withOutCommaString.match(regexToValidateNumber) || e.target.value === '') {
            this.setState({value: withOutCommaString.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,')});
            this.props.onChange(this);
        }
    }
},

module.exports = React.createClass({
    displayName: 'Currency',
    mixins: [valueMixin, multiMixin, inputMixin]
});
