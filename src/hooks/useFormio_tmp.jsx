import React from 'react';
import Formio from 'formiojs';
import isEqual from 'lodash/isEqual';

export const useFormio = (formSrcOrDefinition, options) => {
	const [form, setForm] = React.useState(null);
	const [submission, setSubmission] = React.useState(null);
	const [formio, setFormio] = React.useState(null);

	React.useEffect(() => {
		const formio = new Formio(formSrcOrDefinition, options);
		setFormio(formio);
		formio.loadForm().then((form) => {
			setForm(form);
		});
	}, [formSrcOrDefinition, options]);

	return {
		form,
		submission,
		formio,
	};
};
