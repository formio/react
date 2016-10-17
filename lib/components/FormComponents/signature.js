'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _reactSignaturePad = require('react-signature-pad');

var _reactSignaturePad2 = _interopRequireDefault(_reactSignaturePad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Signature',
  mixins: [_valueMixin2.default],
  onEnd: function onEnd(type, image) {
    this.setValue(this.signature.toDataURL());
  },
  componentDidMount: function componentDidMount() {
    this.signature = this.refs[this.props.component.key];
    if (this.state.value) {
      this.signature.fromDataURL(this.state.value);
    }
  },
  clearSignature: function clearSignature(ref) {
    var signature = this.refs[ref];
    signature.clear();
  },
  getElements: function getElements() {
    var footerStyle = { textAlign: 'center', color: '#C3C3C3' };
    var footerClass = 'formio-signature-footer' + (this.props.component.validate.required ? ' required' : '');
    var ref = this.props.component.key;
    var styles = {
      height: 'auto',
      width: this.props.component.width
    };
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('span', { className: ' glyphicon glyphicon-refresh', onClick: this.clearSignature.bind(null, ref) }),
      _react2.default.createElement(
        'div',
        { style: styles },
        _react2.default.createElement(_reactSignaturePad2.default, _extends({
          ref: this.props.component.key
        }, this.props.component, {
          onEnd: this.onEnd
        }))
      ),
      _react2.default.createElement(
        'div',
        { className: footerClass, style: footerStyle },
        this.props.component.footer
      )
    );
  }
});