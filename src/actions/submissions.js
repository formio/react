import formiojs from 'formiojs';

export const SUBMISSIONS_REQUEST = 'SUBMISSIONS_REQUEST';
function requestSubmissions(name, page) {
  return {
    type: SUBMISSIONS_REQUEST,
    name,
    page
  };
}

export const SUBMISSIONS_SUCCESS = 'SUBMISSIONS_SUCCESS';
function receiveSubmissions(name, submissions) {
  return {
    type: SUBMISSIONS_SUCCESS,
    submissions,
    name
  };
}

export const SUBMISSIONS_FAILURE = 'SUBMISSIONS_FAILURE';
function failSubmissions(name, err) {
  return {
    type: SUBMISSIONS_FAILURE,
    error: err,
    name
  };
}

export const fetchSubmissions = (name, page=1) => {
  return (dispatch, getState) => {
    dispatch(requestSubmissions(name, page));
    const submissions = getState().formio[name].submissions;

    let params = {};
    if (submissions.limit != 10) {
      params.limit = submissions.limit;
    }
    if (page !== 1) {
      params.skip = ((parseInt(page) - 1) * submissions.limit);
      params.limit = submissions.limit;
    }
    const formio = formiojs(submissions.src);

    formio.loadSubmissions({params})
      .then((result) => {
        dispatch(receiveSubmissions(name, result));
      })
      .catch((result) => {
        dispatch(failSubmissions(name. result));
      });
  };
};
