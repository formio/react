'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _multiMixin = require('./mixins/multiMixin');

var _multiMixin2 = _interopRequireDefault(_multiMixin);

var _inputMixin = require('./mixins/inputMixin');

var _inputMixin2 = _interopRequireDefault(_inputMixin);

var _componentMixin = require('./mixins/componentMixin');

var _componentMixin2 = _interopRequireDefault(_componentMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Currency',
  mixins: [_inputMixin2.default, _valueMixin2.default, _multiMixin2.default, _componentMixin2.default],
  onChangeCustom: function onChangeCustom(value) {
    // May be better way than adding to prototype.
    var splice = function splice(string, idx, rem, s) {
      return string.slice(0, idx) + s + string.slice(idx + Math.abs(rem));
    };
    //clearing left side zeros
    while (value.charAt(0) === '0') {
      value = value.substr(1);
    }

    value = value.replace(/[^\d.\',']/g, '');

    var point = value.indexOf('.');
    if (point >= 0) {
      value = value.slice(0, point + 3);
    }

    var decimalSplit = value.split('.');
    var intPart = decimalSplit[0];
    var decPart = decimalSplit[1];

    intPart = intPart.replace(/[^\d]/g, '');
    if (intPart.length > 3) {
      var intDiv = Math.floor(intPart.length / 3);
      while (intDiv > 0) {
        var lastComma = intPart.indexOf(',');
        if (lastComma < 0) {
          lastComma = intPart.length;
        }

        if (lastComma - 3 > 0) {
          intPart = splice(intPart, lastComma - 3, 0, ',');
        }
        intDiv--;
      }
    }

    if (decPart === undefined) {
      decPart = '';
    } else {
      decPart = '.' + decPart;
    }
    var res = intPart + decPart;

    return res;
  }
});