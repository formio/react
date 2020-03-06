'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.submissions = submissions;

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function submissions(_ref) {
  var name = _ref.name,
      _ref$limit = _ref.limit,
      limit = _ref$limit === undefined ? 10 : _ref$limit,
      _ref$query = _ref.query,
      query = _ref$query === undefined ? {} : _ref$query,
      _ref$select = _ref.select,
      select = _ref$select === undefined ? '' : _ref$select,
      _ref$sort = _ref.sort,
      sort = _ref$sort === undefined ? '' : _ref$sort;

  var initialState = {
    error: '',
    formId: '',
    isActive: false,
    limit: limit,
    pagination: {
      numPages: 0,
      page: 1,
      total: 0
    },
    query: query,
    select: select,
    sort: sort,
    submissions: []
  };

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    // Only proceed for this submissions.
    if (action.name !== name) {
      return state;
    }

    switch (action.type) {
      case types.SUBMISSIONS_RESET:
        return initialState;
      case types.SUBMISSIONS_REQUEST:
        return _extends({}, state, (0, _pick3.default)(action.params, ['limit', 'query', 'select', 'sort']), {
          error: '',
          formId: action.formId,
          isActive: true,
          pagination: _extends({}, state.pagination, {
            page: action.page
          }),
          submissions: []
        });
      case types.SUBMISSIONS_SUCCESS:
        {
          var total = action.submissions.serverCount;

          return _extends({}, state, {
            isActive: false,
            pagination: _extends({}, state.pagination, {
              numPages: Math.ceil(total / state.limit),
              total: total
            }),
            submissions: action.submissions
          });
        }
      case types.SUBMISSIONS_FAILURE:
        return _extends({}, state, {
          error: action.error,
          isActive: false
        });
      default:
        return state;
    }
  };
}