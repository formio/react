'use strict'

module.exports = React.createClass({
  displayName: 'Button',
  render: function() {
    return(
      <button
        type={this.props.component.action == 'submit' ? 'submit' : 'button'}
        disabled={this.props.isSubmitting}
      >{this.props.component.label}</button>);
  }
});