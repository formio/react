var React = require('react');
var FormioComponents = require('../FormioComponents.jsx');

module.exports = React.createClass({
  displayName: 'Well',
  render: function() {
    return (
      <div className="well">
        <FormioComponents
          {...this.props}
          components={this.props.component.components}
        ></FormioComponents>
      </div>
    );
  }
});
