import React, {useEffect, useRef, useCallback, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {FormBuilder as FormioFormBuilder} from '@formio/js';

const FormBuilder = (props) => {
  const {
    options = {},
    Builder = FormioFormBuilder,
    form,
  } = props;
  const builderRef = useRef();
  let element;

  const emit = (funcName) => (...args) => {
    // eslint-disable-next-line no-prototype-builtins
    if (props.hasOwnProperty(funcName) && typeof (props[funcName]) === 'function') {
      props[funcName](...args);
    }
  };

  const onChange = () => {
    const {onChange} = props;
    if (onChange && typeof onChange === 'function') {
      const schema = {
        ...builderRef.current.instance.form
      };

      Object.defineProperty(schema, 'components', {
        get: function() {
          return builderRef.current.instance.schema.components;
        }
      });

      onChange(builderRef.current.instance.form, schema);
    }
  };

  const builderEvents = [
    {name: 'saveComponent', action: emit('onSaveComponent')},
    {name: 'updateComponent', action: emit('onUpdateComponent')},
    {name: 'removeComponent', action: emit('onDeleteComponent')},
    {name: 'cancelComponent', action: emit('onUpdateComponent')},
    {name: 'editComponent', action: emit('onEditComponent')},
    {name: 'addComponent', action: onChange},
    {name: 'saveComponent', action: onChange},
    {name: 'updateComponent', action: onChange},
    {name: 'removeComponent', action: onChange},
    {name: 'deleteComponent', action: onChange},
    {name: 'pdfUploaded', action: onChange},
  ];

  const initializeBuilder = (builderProps) => {
    let {options, form} = builderProps;
    const {Builder} = builderProps;
    options = Object.assign({}, options);
    form = Object.assign({}, form);

    builderRef.current = new Builder(element, form, options);

    builderRef.current.ready.then(() => {
      onChange();
      builderEvents.forEach(({name, action}) => {
        builderRef.current.instance.off(name, action);
        builderRef.current.instance.on(name, action);
      });
    });
  };

  useEffect(() => {
    initializeBuilder({options, Builder, form});
    return () => (builderRef.current ? builderRef.current.instance.destroy(true) : null);
  }, [builderRef]);

  useEffect(() => {
    if (!builderRef.current && form) {
      initializeBuilder({options, Builder, form});
    }
  }, [form, builderRef]);

  const elementDidMount = useCallback((el) => element = el);

  useLayoutEffect(() => {
    if (builderRef.current && form && form.display) {
      builderRef.current.setDisplay(form.display);
    }
  }, [form.display]);

  useLayoutEffect(() => {
    if (builderRef.current && form && form.components) {
      builderRef.current.setForm(form);
    }
  }, [form]);

  return (
    <div>
      <div ref={elementDidMount}></div>
    </div>
  );
};

FormBuilder.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onChange: PropTypes.func,
  onSaveComponent: PropTypes.func,
  onUpdateComponent: PropTypes.func,
  onDeleteComponent: PropTypes.func,
  onCancelComponent: PropTypes.func,
  onEditComponent: PropTypes.func,
  Builder: PropTypes.any
};

export default FormBuilder;
