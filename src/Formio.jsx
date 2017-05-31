import React from 'react';
import PropTypes from 'prop-types';
import Formiojs from 'formiojs';
import { FormioFactory } from 'formiojs/factory';

export class Formio extends React.Component {
  static defaultProps = {
    options: {}
  };

  static propTypes = {
    src: PropTypes.string,
    form: PropTypes.object,
    submission: PropTypes.object,
    options: PropTypes.shape({
      readOnly: PropTypes.boolean,
      noAlerts: PropTypes.boolean,
      i18n: PropTypes.string,
      template: PropTypes.string
    }),
    onPrevPage: PropTypes.func,
    onNextPage: PropTypes.func,
    onChange: PropTypes.func,
    onCustomEvent: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitDone: PropTypes.func,
    onError: PropTypes.func,
    onRender: PropTypes.func
  };

  constructor(props) {
    super(props);

    //this.state = {
    //};
  }

  componentDidMount = () => {
    const { options, src, form, submission } = this.props;
    this.createPromise;

    if (src) {
      this.createPromise = FormioFactory.createForm(this.element, src, options).then(formio => this.formio = formio);
    }
    if (form) {
      this.createPromise = FormioFactory.createForm(this.element, form, options).then(formio => this.formio = formio);
    }
    if (submission) {
      this.createPromise.then(() => {
        this.formio.submission = submission;
      });
    }

    if (this.createPromise) {
      this.createPromise.then(() => {
        console.log(this.element, this.formio);
        this.formio.on('prevPage', this.callEvent('onPrevPage'));
        this.formio.on('nextPage', this.callEvent('onNextPage'));
        this.formio.on('change', this.callEvent('onChange'));
        this.formio.on('customEvent', this.callEvent('onCustomEvent'));
        this.formio.on('submit', this.callEvent('onSubmit'));
        this.formio.on('submitDone', this.callEvent('onSubmitDone'));
        this.formio.on('error', this.callEvent('onError'));
        this.formio.on('render', this.callEvent('onRender'));
      });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.src !== nextProps.src) {
      this.formio = new FormioForm(this.element, options);
      this.formio.src = nextProps.src;
    }
    if (this.props.form !== nextProps.form) {
      this.formio.form = nextProps.form;
    }
    if (this.props.submission !== nextProps.submission) {
      this.formio.submission = nextProps.submission;
    }
  };

  render = () => {
    return <div ref={element => this.element = element} />;
  };

  callEvent = (funcName) => {
    return (...args) => {
      if (this.props.hasOwnProperty(funcName) && typeof (this.props[funcName]) === 'function') {
        this.props[funcName](...args);
      }
    }
  };
}
