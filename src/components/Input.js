import React from 'react';
import PropTypes from 'prop-types';

const Input = (props) => {
  return (
    <input
      type="text"
      key="search-field"
      value={props.regexp}
      onChange={props.handleChange}
      className="form-control"
      placeholder="Search Forms"
    />
  );
};

Input.propTypes = {
  regexp: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};

export default Input;
