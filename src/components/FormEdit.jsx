import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import _cloneDeep from 'lodash/cloneDeep';
import _camelCase from 'lodash/camelCase';

const reducer = (form, { type, value }) => {
    const formCopy = _cloneDeep(form);
    switch (type) {
        case 'formChange':
            for (let prop in value) {
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
        default:
            formCopy[type] = value;
            break;
    }
    return formCopy;
};

const FormEdit = (props) => {
    const [form, dispatchFormAction] = useReducer(
        reducer,
        _cloneDeep(props.form)
    );

    useEffect(() => {
        const { form: newForm } = props;
        if (
            newForm &&
            (form._id !== newForm._id || form.modified !== newForm.modified)
        ) {
            dispatchFormAction({ type: 'replaceForm', value: newForm });
        }
    }, [props.form]);

    const saveForm = () => {
        const { saveForm } = props;
        if (saveForm && typeof saveForm === 'function') {
            saveForm(form);
        }
    };

    const handleChange = (path, event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        dispatchFormAction({ type: path, value });
    };

    const formChange = (newForm) => {
        dispatchFormAction({ type: 'formChange', value: newForm });
    };

    return (
        <div>
            {/* Your form editing inputs */}
            <FormBuilder form={form} onChange={formChange} />
            <button onClick={saveForm}>Save Form</button>
        </div>
    );
};

FormEdit.propTypes = {
    form: PropTypes.object.isRequired,
    saveForm: PropTypes.func.isRequired,
};

export default FormEdit;
