var React = require('react');

module.exports = React.createClass({
  displayName: 'Hidden',
  render: function() {
    var value = (this.props.data && this.props.data.hasOwnProperty(this.props.component.key)) ? this.props.data[this.props.component.key] : '';
    return (
      <input type="hidden" id={this.props.component.key} name={this.props.component.key} value={value}></input>
    );
  }
});
