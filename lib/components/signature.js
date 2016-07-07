'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var SignaturePad = require('react-signature-pad');

module.exports = React.createClass({
  displayName: 'Signature',
  mixins: [valueMixin],
  onEnd: function onEnd(type, image) {
    this.setState({
      value: this.signature.toDataURL()
    });
  },
  componentDidMount: function componentDidMount() {
    this.signature = this.refs[this.props.component.key];
    if (this.state.value) {
      this.signature.fromDataURL(this.state.value);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.signature.fromDataURL(nextProps.value);
    }
    this.setState({
      value: nextProps.value
    });
  },
  getElements: function getElements() {
    var footerStyle = { textAlign: 'center', color: '#C3C3C3' };
    var footerClass = 'formio-signature-footer' + (this.props.component.validate.required ? ' required' : '');
    var styles = {
      height: this.props.component.height,
      width: this.props.component.width
    };
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { style: styles },
        React.createElement(SignaturePad, _extends({
          ref: this.props.component.key,
          clearButton: 'true'
        }, this.props.component, {
          onEnd: this.onEnd
        }))
      ),
      React.createElement(
        'div',
        { className: footerClass, style: footerStyle },
        this.props.component.footer
      )
    );
  }
});