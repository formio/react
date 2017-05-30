import React from 'react';
import PropTypes from 'prop-types';
import Formiojs from 'formiojs';

export class Formio extends React.Component {
  static defaultProps = {};

  static propTypes = {
    src: PropTypes.string,
    form: PropTypes.object,
    submission: PropTypes.object,
    loading: PropTypes.boolean
  };

  constructor(props) {
    super(props);

    //this.state = {
    //};
  }

  componentDidMount = () => {

  };

  render = () => {
    return <div ref={element => this.element} />;
  };
}
