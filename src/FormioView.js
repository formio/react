import PropTypes from 'prop-types';
import ReduxView from 'redux-view';
import formioConnect from './formioConnect';

export default class FormioView extends ReduxView {
  constructor(props, context) {
    super(props, context);
    this.router = context.router;
    this.formio = context.formio;
  }

  static contextTypes = {
    router: PropTypes.object,
    formio: PropTypes.object
  }

  connect = formioConnect
}