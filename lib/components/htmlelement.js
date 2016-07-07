'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
    displayName: 'HtmlElement',
    mixins: [valueMixin, multiMixin],
    getSingleElement: function getSingleElement(value, index) {
        return React.createElement(
            this.props.component.tag,
            {
                className: this.props.component.className
            },
            this.props.component.content
        );
    }
});