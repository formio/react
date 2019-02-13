import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Loader extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isLoading: true
  };

  constructor(props) {
    super(props);
  }

  render() {
    return this.props.isLoading
      ? <div className="formio-loader-wrapper">
          <div className="formio-loader"/>
        </div>
      : null;
  }
}
