import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import AllComponents from 'formiojs/components';
import Components from 'formiojs/components/Components';
import FormioFormBuilder from 'formiojs/FormBuilder';

Components.setComponents(AllComponents);

const FormBuilder = (props) => {
  let builder;
  let builderReady;
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
      onChange(builder.instance.form);
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

    builder = new Builder(element.firstChild, form, options);
    builderReady = builder.ready;

    builderReady.then(() => {
      onChange();
      builderEvents.forEach(({name, action}) => builder.instance.on(name, action));
    });
  };

  useEffect(() => {
    initializeBuilder(props);
    return () => builder ? builder.instance.destroy(true) : null;
  }, [props.form.display, props.form.components, props.options]);

  return (
    <div ref={el => element = el}>
      <div></div>
    </div>
  );
};

FormBuilder.defaultProps = {
  options: {},
  Builder: FormioFormBuilder
};

FormBuilder.propTypes = {
  form: PropTypes.object,
  options: PropTypes.object,
  onSaveComponent: PropTypes.func,
  onUpdateComponent: PropTypes.func,
  onDeleteComponent: PropTypes.func,
  onCancelComponent: PropTypes.func,
  onEditComponent: PropTypes.func,
  Builder: PropTypes.any
};

export default FormBuilder;
