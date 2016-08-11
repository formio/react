var React = require('react');

module.exports = React.createClass({
  displayName: 'Custom',
  render: function() {
    var value = (this.props.data && this.props.data.hasOwnProperty(this.props.component.key)) ? this.props.data[this.props.component.key] : '';
    return (
      <div className="panel panel-default">
        <div className="panel-body text-muted text-center">
          Custom Component ({ this.props.component.type })
        </div>
      </div>
    );
  }
});
