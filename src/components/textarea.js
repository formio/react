'use strict'

module.exports = React.createClass({
  displayName: 'Textarea',
  render: function() {
    return(
      <textarea
        className="form-control"
        placeholder={this.props.component.placeholder }
      >
      </textarea>
    );
  }
});