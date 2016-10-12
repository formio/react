"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var message = _ref.message;
  var buttons = _ref.buttons;

  var buttonElements = buttons.map(function (button, index) {
    return _react2.default.createElement(
      "span",
      { key: index, onClick: button.callback, className: button.class },
      button.text
    );
  });
  return _react2.default.createElement(
    "form",
    { role: "form" },
    _react2.default.createElement(
      "h3",
      null,
      message
    ),
    _react2.default.createElement(
      "div",
      { className: "btn-toolbar" },
      buttonElements
    )
  );
};

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }