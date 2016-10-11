'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  console.log('here');
  console.log(undefined);
  return _react2.default.createElement(
    'div',
    { className: 'form-container' },
    _react2.default.createElement(
      'h3',
      null,
      'Container'
    ),
    _react2.default.createElement(
      _reactRouter.Link,
      { to: undefined.base + '/' + undefined.name + '/' + params[undefined.name + 'Id'] },
      'View'
    ),
    _react2.default.createElement(
      _reactRouter.Link,
      { to: undefined.base + '/' + undefined.name + '/' + params[undefined.name + 'Id'] + '/edit' },
      'Edit'
    ),
    _react2.default.createElement(
      _reactRouter.Link,
      { to: undefined.base + '/' + undefined.name + '/' + params[undefined.name + 'Id'] + '/delete' },
      'Delete'
    ),
    _react2.default.createElement(_reactRouter.Match, { pattern: undefined.base + '/' + undefined.name + '/:' + undefined.name + 'Id', exactly: true, component: undefined.View }),
    _react2.default.createElement(_reactRouter.Match, { pattern: undefined.base + '/' + undefined.name + '/:' + undefined.name + 'Id' + '/edit', exactly: true, component: undefined.Edit }),
    _react2.default.createElement(_reactRouter.Match, { pattern: undefined.base + '/' + undefined.name + '/:' + undefined.name + 'Id' + '/delete', exactly: true, component: undefined.Delete })
  );
};