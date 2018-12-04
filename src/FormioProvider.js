import {Component, Children} from 'react';
import PropTypes from 'prop-types';

export default class FormioProvider extends Component {
  static propTypes = {
    formio: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    formio: PropTypes.object.isRequired
  };

  static displayName = 'Provider';

  getChildContext() {
    return {formio: this.formio};
  }

  constructor(props, context) {
    super(props, context);
    this.formio = props.formio;
  }

  render() {
    return Children.only(this.props.children);
  }
}
