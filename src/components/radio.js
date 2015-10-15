'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var multiMixin = require('./mixins/multiMixin');

module.exports = React.createClass({
  displayName: 'Radio',
  mixins: [componentMixin, multiMixin],
  getSingleElement: function(value, index) {
    index = index || 0;
    return(
      <div className="radio-wrapper">
        {this.props.component.values.map(function(v) {
          return (
            <div className="radio">
              <label className="control-label">
                <input
                  type={this.props.component.inputType}
                  id={v.value}
                  data-index={index}
                  name={this.props.component.key}
                  value={v.value}
                  disabled={this.props.readOnly}
                  onChange={this.onChange}
                  ></input>
                {v.label}
              </label>
            </div>
          );
        }.bind(this))
        }
      </div>
    );
  }
});