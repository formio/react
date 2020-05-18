"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  var getRoot = function getRoot(state) {
    return config.rootSelector(state)[config.name];
  };
  var getForm = function getForm(state) {
    return getRoot(state).form;
  };
  var getForms = function getForms(state) {
    return getRoot(state).forms;
  };
  var getSubmission = function getSubmission(state) {
    return getRoot(state).submission;
  };
  var getSubmissions = function getSubmissions(state) {
    return getRoot(state).submissions;
  };

  return {
    getForm: getForm,
    getForms: getForms,
    getSubmission: getSubmission,
    getSubmissions: getSubmissions
  };
};