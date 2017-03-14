'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

var _reactSignatureCanvas = require('react-signature-canvas');

var _reactSignatureCanvas2 = _interopRequireDefault(_reactSignatureCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Signature',
  mixins: [_valueMixin2.default, _componentMixin2.default],
  onEnd: function onEnd() {
    this.setValue(this.signature.getCanvas().toDataURL());
  },
  componentDidMount: function componentDidMount() {
    if (this.state.value) {
      this.signature.fromDataURL(this.state.value);
    } else {
      this.signature.clear();
    }
  },
  willReceiveProps: function willReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.signature.fromDataURL(nextProps.value);
    }
  },
  clearSignature: function clearSignature() {
    this.signature.clear();
    this.setValue(null);
  },
  getElements: function getElements() {
    var _this = this;

    var component = this.props.component;

    var footerClass = 'formio-signature-footer' + (component.validate.required ? ' required' : '');
    var ref = component.key;
    var styles = {
      height: component.height,
      width: component.width
    };
    if (this.props.readOnly) {
      return _react2.default.createElement(
        'div',
        { className: 'm-signature-pad', style: styles },
        _react2.default.createElement('img', { alt: 'Signature', className: 'signature-canvas', src: this.state.value })
      );
    }
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('span', { className: ' glyphicon glyphicon-refresh', onClick: this.clearSignature }),
      _react2.default.createElement(
        'div',
        { className: 'm-signature-pad' },
        _react2.default.createElement(
          'div',
          { className: 'm-signature-pad--body', style: styles },
          _react2.default.createElement(_reactSignatureCanvas2.default, {
            ref: function ref(_ref) {
              _this.signature = _ref;
            },
            minWidth: Number(component.minWidth),
            maxWidth: Number(component.maxWidth),
            penColor: component.penColor,
            backgroundColor: component.backgroundColor,
            canvasProps: {
              className: 'signature-canvas'
            },
            onEnd: this.onEnd
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: footerClass },
        component.footer
      )
    );
  }
});