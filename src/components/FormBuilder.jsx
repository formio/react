import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder as FormioFormBuilder } from '@formio/js';

const FormBuilder = (props) => {
    const builderRef = useRef(null);

    useEffect(() => {
        if (!builderRef.current) {
            const { form, options = {}, Builder = FormioFormBuilder } = props;
            builderRef.current = new Builder(builderRef.current, form, options);
        }

        return () => {
            if (builderRef.current) {
                builderRef.current.instance.destroy(true);
                builderRef.current = null;
            }
        };
    }, [props.form, props.options, props.Builder]);

    return <div ref={builderRef} />;
};

FormBuilder.propTypes = {
    form: PropTypes.object,
    options: PropTypes.object,
    Builder: PropTypes.any,
};

export default FormBuilder;
