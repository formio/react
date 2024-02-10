import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Formio } from '@formio/js';

const Form = (props) => {
    const [formio, setFormio] = useState(null);
    const formioRef = useRef(null);

    useEffect(() => {
        if (!formio) {
            const { src, form, options = {}, formReady, submission } = props;
            const instance = new Formio.Form(formioRef.current, src || form, options);

            instance.then((formioInstance) => {
                setFormio(formioInstance);
                if (formReady) {
                    formReady(formioInstance);
                }
            });

            return () => {
                instance.then((formioInstance) => formioInstance.destroy(true));
            };
        }
    }, [formio, props.src, props.form, props.options, props.formReady]);

    useEffect(() => {
        if (formio && props.submission) {
            formio.submission = props.submission;
        }
    }, [formio, props.submission]);

    return <div ref={formioRef} />;
};

Form.propTypes = {
    src: PropTypes.string,
    form: PropTypes.object,
    options: PropTypes.object,
    formReady: PropTypes.func,
    submission: PropTypes.object,
};

export default Form;
