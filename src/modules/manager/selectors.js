export default function(config) {
  const getRoot = state => config.rootSelector(state)[config.name];
  const getForm = state => getRoot(state).form;
  const getForms = state => getRoot(state).forms;
  const getSubmission = state => getRoot(state).submission;
  const getSubmissions = state => getRoot(state).submissions;

  return {
    getForm,
    getForms,
    getSubmission,
    getSubmissions
  };
}
