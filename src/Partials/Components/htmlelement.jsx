import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';

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
