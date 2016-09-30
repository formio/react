"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { "default": obj };
}

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

//import Formio from 'react-formio';

exports["default"] = function () {
  //<Formio src="currentResource.submissionUrl" read-only="true"/>
  return _react2["default"].createElement("div", { className: "form-view" }, "View");
};

module.exports = exports["default"];