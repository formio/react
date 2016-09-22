'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

var _selectMixin = require('./mixins/selectMixin');

var _selectMixin2 = _interopRequireDefault(_selectMixin);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Address',
  mixins: [_valueMixin2.default, _selectMixin2.default],
  getTextField: function getTextField() {
    return 'formatted_address';
  },
  getValueField: function getValueField() {
    return null;
  },
  doSearch: (0, _debounce2.default)(function (text) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + text + '&sensor=false').then(function (response) {
      response.json().then(function (data) {
        this.setState({
          selectItems: data.results
        });
      }.bind(this));
    }.bind(this));
  }, 200)
});