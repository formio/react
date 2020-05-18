'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formioConnect;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * formioConnect makes the formio object in context available to mapStateToProps and mapDispatchToProps.
 */
function formioConnect() {
  return (0, _recompose.compose)((0, _recompose.getContext)({ formio: _propTypes2.default.object }), (0, _recompose.getContext)({ router: _propTypes2.default.object }), _reactRedux.connect.apply(undefined, arguments));
}