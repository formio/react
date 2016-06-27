var React = require('react');
var valueMixin = require('./mixins/valueMixin.jsx');
var multiMixin = require('./mixins/multiMixin.jsx');

module.exports = React.createClass({
    displayName: 'HtmlElement',
    mixins: [valueMixin, multiMixin],
    getSingleElement: function(value, index) {
        return (<this.props.component.tag
            className={this.props.component.className}
            >
            {this.props.component.content}
        </this.props.component.tag>
        );
    }
});
