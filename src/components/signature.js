'use strict'

var React = require('react');
var componentMixin = require('./mixins/componentMixin');
var SignaturePad = require('react-signature-pad');

module.exports = React.createClass({
  displayName: 'Signature',
  mixins: [componentMixin],
  onEnd: function(type, image) {
    this.setState({
      value: this.signature.toDataURL()
    });
  },
  componentDidMount: function() {
    this.signature = this.refs[this.props.component.key];
    console.log(this.state);
    if (this.state.value) {
      this.signature.fromDataURL(this.state.value);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value) {
      this.signature.fromDataURL(nextProps.value);
    }
    this.setState({
      value: nextProps.value
    });
  },
  getElements: function() {
    var footerStyle = {textAlign: "center", color:"#C3C3C3"};
    var footerClass = "formio-signature-footer" + (this.props.component.validate.required ? ' required' : '');
    var styles = {
      height: this.props.component.height,
      width: this.props.component.width,
    }
    return(
      <div>
        <div style={styles}>
          <SignaturePad
            ref={this.props.component.key}
            clearButton="true"
            {...this.props.component}
            onEnd={this.onEnd}
            />
        </div>
        <div className={footerClass} style={footerStyle}>{this.props.component.footer}</div>
      </div>
    );
  }
});