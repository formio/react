'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubmissions = exports.resetSubmissions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Formio = require('formiojs/Formio');

var _Formio2 = _interopRequireDefault(_Formio);

var _root = require('../root');

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resetSubmissions = exports.resetSubmissions = function resetSubmissions(name) {
  return {
    type: types.SUBMISSIONS_RESET,
    name: name
  };
};

var requestSubmissions = function requestSubmissions(name, page, params, formId) {
  return {
    type: types.SUBMISSIONS_REQUEST,
    name: name,
    page: page,
    params: params,
    formId: formId
  };
};

var receiveSubmissions = function receiveSubmissions(name, submissions) {
  return {
    type: types.SUBMISSIONS_SUCCESS,
    name: name,
    submissions: submissions
  };
};

var failSubmissions = function failSubmissions(name, error) {
  return {
    type: types.SUBMISSIONS_FAILURE,
    name: name,
    error: error
  };
};

var getSubmissions = exports.getSubmissions = function getSubmissions(name) {
  var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var formId = arguments[3];
  var done = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
  return function (dispatch, getState) {
    dispatch(requestSubmissions(name, page, params, formId));

    var _selectRoot = (0, _root.selectRoot)(name, getState()),
        limit = _selectRoot.limit,
        query = _selectRoot.query,
        select = _selectRoot.select,
        sort = _selectRoot.sort;

    var formio = new _Formio2.default(_Formio2.default.getProjectUrl() + '/' + (formId ? 'form/' + formId : name) + '/submission');
    var requestParams = _extends({}, query, params);

    // Ten is the default so if set to 10, don't send.
    if (limit !== 10) {
      requestParams.limit = limit;
    } else {
      delete requestParams.limit;
    }

    if (page !== 1) {
      requestParams.skip = (page - 1) * limit;
    } else {
      delete requestParams.skip;
    }

    if (select) {
      requestParams.select = select;
    } else {
      delete requestParams.select;
    }

    if (sort) {
      requestParams.sort = sort;
    } else {
      delete requestParams.sort;
    }

    return formio.loadSubmissions({ params: requestParams }).then(function (result) {
      dispatch(receiveSubmissions(name, result));
      done(null, result);
    }).catch(function (error) {
      dispatch(failSubmissions(name, error));
      done(error);
    });
  };
};