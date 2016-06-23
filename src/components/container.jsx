'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');
var FormioComponent = require('../FormioComponent');

module.exports = React.createClass({
    displayName: 'Container',
    mixins: [componentMixin, multiMixin],
    getSingleElement: function(value, index) {
        return(
            <div>
            {this.props.component.components.map(function(component) {
                    var value = (this.props.data && this.props.data.hasOwnProperty(component.key) ? this.props.data[component.key] : component.defaultValue || '');
                    var key = (component.key) ? component.key : component.type;
                    return (
                        <FormioComponent
                            {...this.props}
                            key={key}
                            name={component.key}
                            component={component}
                            value={value}
                        />
                    );
                }.bind(this))}
            </div>
        );
    }
});