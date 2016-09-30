import {SUBMISSIONS_REQUEST, SUBMISSIONS_SUCCESS, SUBMISSIONS_FAILURE} from '../actions/submissions';

export default (name, src) => {
  return (state = {
    src: src + '/submission',
    name: name,
    isFetching: false,
    lastUpdated: 0,
    submissions: [],
    limit: 10,
    pagination: {
      page: 1
    },
    error: ''
  }, action) => {
    // Only proceed for this form.
    if (action.name !== state.name) {
      return state;
    }
    switch (action.type) {
      case SUBMISSIONS_REQUEST:
        return {
          ...state,
          limit: action.limit || state.limit,
          isFetching: true,
          submissions: [],
          pagination: {
            page: action.page || state.pagination.page
          },
          error: ''
        };
      case SUBMISSIONS_SUCCESS:
        return {
          ...state,
          submissions: action.submissions,
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil(action.submissions.serverCount / state.limit),
            total: action.submissions.serverCount
          },
          isFetching: false,
          error: ''
        };
      case SUBMISSIONS_FAILURE:
        return {
          ...state,
          isFetching: false,
          error: action.error
        };
      default:
        return state;
    }
  };
};
