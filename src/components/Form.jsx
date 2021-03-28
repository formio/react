import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter2';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
import FormioForm from 'formiojs/Form';

Components.setComponents(AllComponents);

const Form = (props) => {
  const { id, src, form, url, submission, onFormReady, options } = props;

  const [formio, setFormio] = useState();
  const initProps = useRef(props);

  const onElementMount = useCallback((formElement) => {
    const { src, form, options, formioForm } = initProps.current;
    const instance = new (formioForm || FormioForm)(formElement, src || form, options);

    instance.onAny((event, ...args) => {
      const handlers = initProps.current;

      if (handlers.onAny) handlers.onAny(...args);

      if (event.startsWith('formio.')) {
        const funcName = `on${event.charAt(7).toUpperCase()}${event.slice(8)}`;
        const handler = handlers[funcName];
        if (handler) handler(...args);
      }
    });

    instance.ready.then((newFormio) => last(setFormio(newFormio), newFormio));
  }, []);

  useEffect(() => () => formio && formio.destroy(true), [formio]);

  const prevProps = useRef({});

  useLayoutEffect(() => {
    if (!formio) return;

    const prev = prevProps.current;

    if (propChanged(url, 'url', prev)) formio.url = url;

    if (propChanged(src, 'src', prev)) formio.src = src;

    if (propChanged(form, 'form', prev)) formio.form = form;

    if (propChanged(submission, 'submission', prev))
      formio.submission = { data: submission };

    if (propChanged(options, 'options', prev) && !options.events)
      options.events = Form.getDefaultEmitter();

    if (propChanged(onFormReady, 'onFormReady', prev)) onFormReady(formio);
  }, [url, src, form, submission, options, onFormReady, formio]);

  return (
    <div id={id} ref={onElementMount} className={props.className} style={props.style} />
  );
};

const propChanged = (prop, name, prev) =>
  prop && prev[name] !== prop ? last((prev[name] = prop), true) : false;

const last = (...args) => args[args.length - 1];

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
    // TODO: add events?
    // events: PropTypes.???,
  }),
  onAny: PropTypes.func,
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
  onFormReady: PropTypes.func,
  formioForm: PropTypes.func,
};

Form.getDefaultEmitter = () => new EventEmitter({ wildcard: false, maxListeners: 0 });

export default Form;
