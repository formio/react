import React from 'react';
import PropTypes from 'prop-types';

const Errors = (props) => {
  const hasErrors = (error) => {
    if (Array.isArray(error)) {
      return error.filter(item => !!item).length !== 0;
    }

    return !!error;
  };

  /**
   * @param {string|any[]} error
   * @returns {string|unknown[]|*}
   */
  const formatError = (error) => {
    if (typeof error === 'string') {
      return error;
    }

    if (Array.isArray(error)) {
      return error.map(formatError);
    }

    // eslint-disable-next-line no-prototype-builtins
    if (error.hasOwnProperty('errors')) {
      return Object.keys(error.errors).map((key, index) => {
        const item = error.errors[key];
        return (
          <div key={index}>
            <strong>{item.name} ({item.path})</strong> - {item.message}
          </div>
        );
      });
    }

    // If this is a standard error.
    // eslint-disable-next-line no-prototype-builtins
    if (error.hasOwnProperty('message')) {
      return error.message;
    }

    // If this is a joy validation error.
    if (error.hasOwnProperty('name') && error.name === 'ValidationError') {
      return error.details.map((item, index) => {
        return (
          <div key={index}>
            {item.message}
          </div>
        );
      });
    }

    // If a conflict error occurs on a form, the form is returned.
    // eslint-disable-next-line no-prototype-builtins
    if (error.hasOwnProperty('_id') && error.hasOwnProperty('display')) {
      return 'Another user has saved this form already. Please reload and re-apply your changes.';
    }

    return 'An error occurred. See console logs for details.';
  };

  // If there are no errors, don't render anything.
  const {errors, type} = props;

  if (!hasErrors(errors)) {
    return null;
  }

  return (
    <div className={`alert alert-${type}`} role="alert">{formatError(errors)}</div>
  );
};

Errors.propTypes = {
  errors: PropTypes.any,
  type: PropTypes.string
};

Errors.defaultProps = {
  type: 'danger'
};

export default Errors;
