import { FORMS_REQUEST, FORMS_SUCCESS, FORMS_FAILURE } from '../actions';

export default (name, src) => {
  return (state = {
    src: src + '/form',
    name: name,
    tag: '',
    isFetching: false,
    lastUpdated: 0,
    forms: [],
    limit: 100,
    pagination: {
      page: 1
    },
    error: ''
  }, action) => {
    // Only proceed for this forms.
    if (action.name !== state.name) {
      return state;
    }
    switch (action.type) {
      case FORMS_REQUEST:
        return {
          ...state,
          limit: action.limit || state.limit,
          tag: action.tag,
          isFetching: true,
          pagination: {
            page: action.page || state.pagination.page
          },
          error: ''
        };
      case FORMS_SUCCESS:
        return {
          ...state,
          forms: action.forms,
          pagination: {
            page: state.pagination.page,
            numPages: Math.ceil(action.forms.serverCount / state.limit),
            total: action.forms.serverCount
          },
          isFetching: false,
          error: ''
        };
      case FORMS_FAILURE:
        return {
          ...state,
          isFetching: false,
          isInvalid: true,
          error: action.error
        };
      default:
        return state;
    }
  };
};
