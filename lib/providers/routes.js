'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioRoutes = undefined;
exports.injectRoute = injectRoute;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = [];

function injectRoute(route) {
  routes.push(_react2.default.createElement(
    'div',
    { key: routes.length + 1 },
    route
  ));
}

var FormioRoutes = exports.FormioRoutes = function FormioRoutes(props, context) {
  return _react2.default.createElement(
    'div',
    null,
    routes
  );
};