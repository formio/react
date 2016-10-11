'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectRoute = injectRoute;
exports.formioRoutes = formioRoutes;

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

function formioRoutes() {
  return routes;
}