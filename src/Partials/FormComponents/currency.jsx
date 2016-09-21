var React = require('react');
var valueMixin = require('./mixins/valueMixin');
var multiMixin = require('./mixins/multiMixin');
var inputMixin = require('./mixins/inputMixin');

module.exports = React.createClass({
  displayName: 'Currency',
  mixins: [inputMixin, valueMixin, multiMixin],
  onChangeCustom: function(value) {
    // May be better way than adding to prototype.
    var splice = function(string, idx, rem, s) {
      return (string.slice(0, idx) + s + string.slice(idx + Math.abs(rem)));
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
    }
    else {
      decPart = '.' + decPart;
    }
    var res = intPart + decPart;

    return res;
  }
});
