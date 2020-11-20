'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Errors = function Errors(props) {
  var hasErrors = function hasErrors(error) {
    if (Array.isArray(error)) {
      return error.filter(function (item) {
        return !!item;
      }).length !== 0;
    }

    return !!error;
  };

  var formatError = function formatError(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (Array.isArray(error)) {
      return error.map(formatError);
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
  };

  // If there are no errors, don't render anything.
  var errors = props.errors,
      type = props.type;


  if (!hasErrors(errors)) {
    return null;
  }

  return _react2.default.createElement(
    'div',
    { className: 'alert alert-' + type, role: 'alert' },
    formatError(errors)
  );
};

Errors.propTypes = {
  errors: _propTypes2.default.any,
  type: _propTypes2.default.string
};

Errors.defaultProps = {
  type: 'danger'
};

exports.default = Errors;