'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Errors = function (_Component) {
  _inherits(Errors, _Component);

  function Errors() {
    _classCallCheck(this, Errors);

    return _possibleConstructorReturn(this, (Errors.__proto__ || Object.getPrototypeOf(Errors)).apply(this, arguments));
  }

  _createClass(Errors, [{
    key: 'hasErrors',
    value: function hasErrors(error) {
      if (Array.isArray(error)) {
        return error.filter(function (item) {
          return !!item;
        }).length !== 0;
      }

      return !!error;
    }
  }, {
    key: 'formatError',
    value: function formatError(error) {
      if (typeof error === 'string') {
        return error;
      }

      if (Array.isArray(error)) {
        return error.map(this.formatError);
      }

      if (error.hasOwnProperty('errors')) {
        return Object.keys(error.errors).map(function (key, index) {
          var item = error.errors[key];
          return _react2.default.createElement(
            'div',
            { key: index },
            _react2.default.createElement(
              'strong',
              null,
              item.name,
              ' (',
              item.path,
              ')'
            ),
            ' - ',
            item.message
          );
        });
      }

      // If this is a standard error.
      if (error.hasOwnProperty('message')) {
        return error.message;
      }

      // If this is a joy validation error.
      if (error.hasOwnProperty('name') && error.name === 'ValidationError') {
        return error.details.map(function (item, index) {
          return _react2.default.createElement(
            'div',
            { key: index },
            item.message
          );
        });
      }

      // If a conflict error occurs on a form, the form is returned.
      if (error.hasOwnProperty('_id') && error.hasOwnProperty('display')) {
        return 'Another user has saved this form already. Please reload and re-apply your changes.';
      }

      return 'An error occurred. See console logs for details.';
    }
  }, {
    key: 'render',
    value: function render() {
      // If there are no errors, don't render anything.
      if (!this.hasErrors(this.props.errors)) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        { className: 'alert alert-' + this.props.type, role: 'alert' },
        this.formatError(this.props.errors)
      );
    }
  }]);

  return Errors;
}(_react.Component);

Errors.propTypes = {
  errors: _propTypes2.default.any,
  type: _propTypes2.default.string
};
Errors.defaultProps = {
  type: 'danger'
};
exports.default = Errors;