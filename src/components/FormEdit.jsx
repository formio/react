import React, {useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import _camelCase from 'lodash/camelCase';
import {Trans, useTranslation} from 'react-i18next';

const reducer = (form, {type, value}) => {
  const formCopy = _cloneDeep(form);
  switch (type) {
    case 'formChange':
      for (let prop in value) {
        // eslint-disable-next-line no-prototype-builtins
        if (value.hasOwnProperty(prop)) {
          form[prop] = value[prop];
        }
      }
      return form;
    case 'replaceForm':
      return _cloneDeep(value);
    case 'title':
      if (type === 'title' && !form._id) {
        formCopy.name = _camelCase(value);
        formCopy.path = _camelCase(value).toLowerCase();
      }
      break;
  }
  _set(formCopy, type, value);
  return formCopy;
};

const FormEdit = (props) => {
  const {
    form: propsForm = {
      title: '',
      name: '',
      path: '',
      display: 'form',
      type: 'form',
      components: [],
    },
    saveText,
    options,
    builder,
    ref,
  } = props;

  const {t, i18n} = useTranslation();
  let language = undefined;
  let i18nOption = undefined;
  if (options) {
    language = options.language;
    i18nOption = options.i18n;
  }
  useEffect(() => {
    if (i18nOption) {
      for (const lang of Object.keys(i18nOption)) {
        i18n.addResourceBundle(
                lang,
                'translations',
                i18nOption[lang],
                true,
                true
              );
      }
    }
  }, [i18nOption]);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const [form, dispatchFormAction] = useReducer(reducer, _cloneDeep(propsForm));
  useEffect(() => {
    const {form: newForm} = props;
    if (newForm && (form._id !== newForm._id || form.modified !== newForm.modified)) {
      dispatchFormAction({type: 'replaceForm', value: newForm});
    }
  }, [propsForm]);

  const saveForm = () => {
    const {saveForm} = props;
    if (saveForm && typeof saveForm === 'function') {
      saveForm(form);
    }
  };

  const handleChange = (path, event) => {
    const {target} = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    dispatchFormAction({type: path, value});
  };

  const formChange = (newForm) => dispatchFormAction({type: 'formChange', value: newForm});

  return (
    <div>
      <div className="row" ref={ref}>
        <div className="col-lg-2 col-md-4 col-sm-4">
          <div id="form-group-title" className="form-group">
            <label htmlFor="title" className="control-label field-required">
              <Trans>Title</Trans>
            </label>
            <input
              type="text"
              className="form-control" id="title"
              placeholder={t('Enter the form title')}
              value={form.title || ''}
              onChange={event => handleChange('title', event)}
            />
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-4">
          <div id="form-group-name" className="form-group">
            <label htmlFor="name" className="control-label field-required">
              <Trans>Name</Trans>
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder={t('Enter the form machine name')}
              value={form.name || ''}
              onChange={event => handleChange('name', event)}
            />
          </div>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-3">
          <div id="form-group-display" className="form-group">
            <label htmlFor="name" className="control-label">
              <Trans>Display as</Trans>
            </label>
            <div className="input-group">
              <select
                className="form-control"
                name="form-display"
                id="form-display"
                value={form.display || ''}
                onChange={event => handleChange('display', event)}
              >
                <option label={t('Form')} value="form">Form</option>
                <option label={t('Wizard')} value="wizard">Wizard</option>
                <option label={t('PDF')} value="pdf">PDF</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-3">
          <div id="form-group-type" className="form-group">
            <label htmlFor="form-type" className="control-label">
              <Trans>Type</Trans>
            </label>
            <div className="input-group">
              <select
                className="form-control"
                name="form-type"
                id="form-type"
                value={form.type}
                onChange={event => handleChange('type', event)}
              >
                <option label={t('Form')} value="form">Form</option>
                <option label={t('Resource')} value="resource">Resource</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-4">
          <div id="form-group-path" className="form-group">
            <label htmlFor="path" className="control-label field-required">
              <Trans>Path</Trans>
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="path"
                placeholder={t('example')}
                style={{'textTransform': 'lowercase', width:'120px'}}
                value={form.path || ''}
                onChange={event => handleChange('path', event)}
              />
            </div>
          </div>
        </div>
        <div id="save-buttons" className="col-lg-2 col-md-5 col-sm-5 save-buttons pull-right">
          <div className="form-group pull-right">
            <span className="btn btn-primary" onClick={() => saveForm()}>
              {saveText}
            </span>
          </div>
        </div>
      </div>
      <FormBuilder
        key={form._id}
        form={form}
        options={options}
        builder={builder}
        onChange={formChange}
      />
    </div>
  );
};

FormEdit.propTypes = {
  form: PropTypes.object.isRequired,
  options: PropTypes.object,
  builder: PropTypes.any,
  saveForm: PropTypes.func,
  saveText: PropTypes.string
};

export default FormEdit;
