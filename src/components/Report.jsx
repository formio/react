import {cloneDeep} from 'lodash/lang';
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'eventemitter2';
import _isEqual from 'lodash/isEqual';
import {Formio} from 'formiojs';
const FormioReport = Formio.Report;

/**
 * @param {ReportProps} props
 * @returns {JSX.Element}s
 */
 const Report = (props) => {
  let instance;
  let createPromise;
  let element;
  const [formio, setFormio] = useState(undefined);
  const jsonReport = useRef(undefined);

  if (!FormioReport) {
    return (<div className="alert alert-danger" role="alert">
      Report is not found in Formio. Please make sure that you are using the Formio Reporting module and it is correctly included in your application.
    </div>);
  }

  useEffect(() => () => formio ? formio.destroy(true) : null, [formio]);

  const createReportInstance = (srcOrReport) => {
    const {options = {}, onReportReady, apiUrl} = props;
    options.apiUrl = apiUrl || options.apiUrl;
    instance = new FormioReport(element, srcOrReport, options);
    createPromise = instance.ready.then(formioInstance => {
      setFormio(formioInstance);
      if (onReportReady) {
        onReportReady(formioInstance);
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
    if (createPromise) {
      instance.onAny(onAnyEvent);
    }
  };

  useEffect(() => {
    const {src} = props;
    if (src) {
      createReportInstance(src).then(() => {
        if (formio) {
          formio.src = src;
        }
      });
      initializeFormio();
    }
  }, [props.src]);

  useEffect(() => {
    const {report, apiUrl} = props;
    // eslint-disable-next-line no-undef
    if (report && !_isEqual(report, jsonReport.current)) {
        jsonReport.current = cloneDeep(report);
      createReportInstance(report).then(() => {
        if (formio) {
          formio.form = {components: [], report};

          if (apiUrl && report) {
            formio.url = `${apiUrl}/project/${report.project}`;
          }
          return formio;
        }
      });
      initializeFormio();
    }
  }, [props.report]);

  useEffect(() => {
    const {options = {}} = props;
    if (!options.events) {
      options.events = Report.getDefaultEmitter();
    }
  }, [props.options]);

  return <div ref={el => element = el} />;
};

/**
 * @typedef {object} Options
 * @property {boolean} [readOnly]
 * @property {boolean} [noAlerts]
 * @property {object} [i18n]
 * @property {string} [template]
 * @property {string} [apiUrl]
 */

/**
 * @typedef {object} ReportProps
 * @property {string} [src]
 * @property {string} [apiUrl]
 * @property {object} [report]
 * @property {Options} [options]
 * @property {function} [onFormLoad]
 * @property {function} [onError]
 * @property {function} [onRender]
 * @property {function} [onFocus]
 * @property {function} [onBlur]
 * @property {function} [onInitialized]
 * @property {function} [onReportReady]
 * @property {function} [onChange]
 * @property {function} [onRowClick]
 * @property {function} [onRowSelectChange]
 * @property {function} [onFetchDataError]
 * @property {function} [onChangeItemsPerPage]
 * @property {function} [onFilter]
 * @property {function} [onClearFilters]
 * @property {function} [onApplyColumns]
 * @property {function} [onPerformAction]
 * @property {function} [onPage]
u */
Report.propTypes = {
  src: PropTypes.string,
  apiUrl: PropTypes.string,
  report: PropTypes.object,
  options: PropTypes.shape({
    readOnly: PropTypes.bool,
    noAlerts: PropTypes.bool,
    i18n: PropTypes.object,
    template: PropTypes.string,
    language: PropTypes.string,
    apiUrl: PropTypes.string,
  }),
  onRowClick: PropTypes.func,
  onRowSelectChange: PropTypes.func,
  onFetchDataError: PropTypes.func,
  onChangeItemsPerPage: PropTypes.func,
  onPage: PropTypes.func,
  onFilter: PropTypes.func,
  onClearFilters: PropTypes.func,
  onApplyColumns: PropTypes.func,
  onPerformAction: PropTypes.func,
  onChange: PropTypes.func,
  onFormLoad: PropTypes.func,
  onError: PropTypes.func,
  onRender: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onInitialized: PropTypes.func,
  onReportReady: PropTypes.func,
};

Report.getDefaultEmitter = () => {
  return new EventEmitter({
    wildcard: false,
    maxListeners: 0
  });
};

export default Report;
