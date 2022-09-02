import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter2';
import _isEqual from 'lodash/isEqual';
import {Formio} from 'formiojs';
const FormioForm = Formio.Form;

/**
 * @param {FormProps} props
 * @returns {JSX.Element}
 */
 const Form = (props) => {
  let instance;
  let createPromise;
  let element;
  const [formio, setFormio] = useState(undefined);
  const [jsonForm, setJsonForm] = useState(undefined);

  useEffect(() => () => formio ? formio.destroy(true) : null, [formio]);

  const createWebformInstance = (srcOrForm) => {
    const {options = {}, formioform, formReady} = props;
    instance = new (formioform || FormioForm)(element, srcOrForm, options);
    createPromise = instance.ready.then(formioInstance => {
      setFormio(formioInstance);
      if (formReady) {
        formReady(formioInstance);
      }
    });

    return createPromise;
  };

  const onAnyEvent = (event, ...args) => {
     if (event.startsWith('formio.')) {
      const funcName = `on${event.charAt(7).toUpperCase()}${event.slice(8)}`;
       // eslint-disable-next-line no-prototype-builtins
      if (props.hasOwnProperty(funcName) && typeof (props[funcName]) === 'function') {
        props[funcName](...args);
      }
    }
  };

  const initializeFormio = () => {
    const {submission} = props;
    if (createPromise) {
      instance.onAny(onAnyEvent);
      createPromise.then(() => {
        if (formio && submission) {
          formio.submission = submission;
        }
      });
    }
  };

  useEffect(() => {
    const {src} = props;
    if (src) {
      createWebformInstance(src).then(() => {
        if (formio) {
          formio.src = src;
        }
      });
      initializeFormio();
    }
  }, [props.src]);

  useEffect(() => {
    const {form, url} = props;
    if (form && !_isEqual(form, jsonForm)) {
      setJsonForm(form);
      createWebformInstance(form).then(() => {
      if (formio) {
        formio.form = form;
        if (url) {
          formio.url = url;
        }
        return formio;
      }
      });
      initializeFormio();
    }
  }, [props.form, jsonForm]);

  useEffect(() => {
    const {options = {}} = props;
    if (!options.events) {
      options.events = Form.getDefaultEmitter();
    }
  }, [props.options]);

  useEffect(() => {
    const {submission} = props;
    if (formio && submission && !_isEqual(formio.submission.data, submission.data)) {
      formio.submission = submission;
    }
  }, [props.submission, formio]);

  return <div ref={el => element = el} />;
};

/**
 * @typedef {object} Options
 * @property {boolean} [readOnly]
 * @property {boolean} [noAlerts]
 * @property {object} [i18n]
 * @property {string} [template]
 * @property {boolean} [saveDraft]
 */

/**
 * @typedef {object} FormProps
 * @property {string} [src]
 * @property {string} [url]
 * @property {object} [form]
 * @property {object} [submission]
 * @property {Options} [options]
 * @property {function} [onPrevPage]
 * @property {function} [onNextPage]
 * @property {function} [onCancel]
 * @property {function} [onChange]
 * @property {function} [onCustomEvent]
 * @property {function} [onComponentChange]
 * @property {function} [onSubmit]
 * @property {function} [onSubmitDone]
 * @property {function} [onFormLoad]
 * @property {function} [onError]
 * @property {function} [onRender]
 * @property {function} [onAttach]
 * @property {function} [onBuild]
 * @property {function} [onFocus]
 * @property {function} [onBlur]
 * @property {function} [onInitialized]
 * @property {function} [formReady]
 * @property {any} [formioform]
 */
Form.propTypes = {
  src: PropTypes.string,
  url: PropTypes.string,
  form: PropTypes.object,
  submission: PropTypes.object,
  options: PropTypes.shape({
    readOnly: PropTypes.bool,
    noAlerts: PropTypes.bool,
    i18n: PropTypes.object,
    template: PropTypes.string,
    saveDraft: PropTypes.bool,
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
  formReady: PropTypes.func,
  formioform: PropTypes.any
};

Form.getDefaultEmitter = () => {
  return new EventEmitter({
    wildcard: false,
    maxListeners: 0
  });
};

export default Form;
