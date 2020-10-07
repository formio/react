import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter2';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
Components.setComponents(AllComponents);
import FormioForm from 'formiojs/Form';

 const Form = (props) => {
  let instance;
  let createPromise;
  let element;
  let formio;

  useEffect(() => () => formio ? formio.destroy(true) : null, [formio]);
  
  const createWebformInstance = (srcOrForm) => {
    const {options = {}, formioform} = props;
    instance = new (formioform || FormioForm)(element, srcOrForm, options);
    createPromise = instance.ready.then(formioInstance => {
      formio = formioInstance;
    });

    return createPromise;
  }

  const onAnyEvent = (event, ...args) => {
     if (event.startsWith('formio.')) {
      const funcName = `on${event.charAt(7).toUpperCase()}${event.slice(8)}`;
      if (props.hasOwnProperty(funcName) && typeof (props[funcName]) === 'function') {
        props[funcName](...args);
      }
    }
  }

  const initializeFormio = () => {
    const {submission} = props;
    if (createPromise) {
      instance.onAny(onAnyEvent);
      createPromise.then(() => {
        if (submission) {
          formio.submission = submission;
        }
      });
    }
  };

  useEffect(() => {
    const {src} = props;
    if (src) {
      createWebformInstance(src).then(() => {
        formio.src = src;
      });
      initializeFormio();
    }
  }, [props.src]);

  useEffect(() => {
    const {form, url} = props;
    if (form) {
      createWebformInstance(form).then(() => {
        formio.form = form;
        if (url) {
          formio.url = url;
        }
        return formio;
      });
      initializeFormio();
    }
  }, [props.form]);

  useEffect(() => {
    const { options } = props;
    if (!options.events) {
      options.events = Form.getDefaultEmitter();
    }
  }, [props.options.events]);

  useEffect(() => {
    if (formio && submission) {
      formio.submission = props.submission;
    }
  }, [props.submission]);

  return <div ref={el => element = el} />;
};

Form.propTypes = {
  src: PropTypes.string,
  url: PropTypes.string,
  form: PropTypes.object,
  submission: PropTypes.object,
  options: PropTypes.shape({
    readOnly: PropTypes.boolean,
    noAlerts: PropTypes.boolean,
    i18n: PropTypes.object,
    template: PropTypes.string,
    saveDraft: PropTypes.boolean,
  }),
  onPrevPage: PropTypes.func,
  onNextPage: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onCustomEvent: PropTypes.func,
  onComponentChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitDone: PropTypes.func,
  onFormLoad: PropTypes.func,
  onError: PropTypes.func,
  onRender: PropTypes.func,
  onAttach: PropTypes.func,
  onBuild: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onInitialized: PropTypes.func,
  formioform: PropTypes.any
};

Form.getDefaultEmitter = () => {
  return new EventEmitter({
    wildcard: false,
    maxListeners: 0
  });
}

export default Form;
