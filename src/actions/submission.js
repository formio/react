import formiojs from 'formiojs';

export const SUBMISSION_REQUEST = 'SUBMISSION_REQUEST';
function requestSubmission(name, src) {
  return {
    type: SUBMISSION_REQUEST
  };
}

export const SUBMISSION_SUCCESS = 'SUBMISSION_SUCCESS';
function receiveSubmission(submission) {
  return {
    type: SUBMISSION_SUCCESS,
    submission
  };
}

export const SUBMISSION_FAILURE = 'SUBMISSION_FAILURE';
function failSubmission(err) {
  return {
    type: SUBMISSION_FAILURE,
    error: err
  };
}

export const fetchSubmission = (name, src) => {
  return (dispatch, getState) => {
    // Check to see if the submission is already loaded.
    if (getState().submission) {
      return;
    }

    dispatch(requestSubmission(name, src));

    const formio = formiojs(src);

    formio.loadSubmission()
      .then((result) => {
        dispatch(receiveSubmission(result));
      })
      .catch((result) => {
        dispatch(failSubmission(result));
      });
  };
};
