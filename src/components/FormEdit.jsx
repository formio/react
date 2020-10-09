import React, {useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import _camelCase from 'lodash/camelCase';

const reducer = (form, {type, value}) => {
  const formCopy = _cloneDeep(form);
  switch (type) {
    case 'formChange':
      return {...form, ...value};
    case 'replaceForm':
      return _cloneDeep(value);
    case 'title':
      if (type === 'title' && !form._id) {
        formCopy.name = _camelCase(value);
        formCopy.path = _camelCase(value).toLowerCase();
      }
      break;
    default:
      return form;
  }
  _set(formCopy, type, value);
  return formCopy;
};

const FormEdit = (props) => {
  const [form, dispatchFormAction] = useReducer(reducer, _cloneDeep(props.form));
  useEffect(() => {
    const {form: newForm} = props;
    if (newForm && (form._id !== newForm._id || form.modified !== newForm.modified)) {
      dispatchFormAction({type: 'replaceForm', value: newForm});
    }
  }, [props.form]);

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

  const {saveText, options, builder} = props;

  return (
    <div>
      <div className="row">
        <div className="col-lg-2 col-md-4 col-sm-4">
          <div id="form-group-title" className="form-group">
            <label htmlFor="title" className="control-label field-required">Title</label>
            <input
              type="text"
              className="form-control" id="title"
              placeholder="Enter the form title"
              value={form.title || ''}
              onChange={event => handleChange('title', event)}
            />
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-4">
          <div id="form-group-name" className="form-group">
            <label htmlFor="name" className="control-label field-required">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter the form machine name"
              value={form.name || ''}
              onChange={event => handleChange('name', event)}
            />
          </div>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-3">
          <div id="form-group-display" className="form-group">
            <label htmlFor="name" className="control-label">Display as</label>
            <div className="input-group">
              <select
                className="form-control"
                name="form-display"
                id="form-display"
                value={form.display || ''}
                onChange={event => handleChange('display', event)}
              >
                <option label="Form" value="form">Form</option>
                <option label="Wizard" value="wizard">Wizard</option>
                <option label="PDF" value="pdf">PDF</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-3">
          <div id="form-group-type" className="form-group">
            <label htmlFor="form-type" className="control-label">Type</label>
            <div className="input-group">
              <select
                className="form-control"
                name="form-type"
                id="form-type"
                value={form.type}
                onChange={event => handleChange('type', event)}
              >
                <option label="Form" value="form">Form</option>
                <option label="Resource" value="resource">Resource</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-4">
          <div id="form-group-path" className="form-group">
            <label htmlFor="path" className="control-label field-required">Path</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="path"
                placeholder="example"
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
  onSave: PropTypes.func
};

FormEdit.defaultProps = {
  form: {
    title: '',
    name: '',
    path: '',
    display: 'form',
    type: 'form',
    components: [],
  }
};

export default FormEdit;
