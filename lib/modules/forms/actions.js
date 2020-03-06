'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexForms = exports.resetForms = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Formio = require('formiojs/Formio');

var _Formio2 = _interopRequireDefault(_Formio);

var _root = require('../root');

var _constants = require('./constants');

var types = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resetForms = exports.resetForms = function resetForms(name) {
  return {
    type: types.FORMS_RESET,
    name: name
  };
};

var requestForms = function requestForms(name, page, params) {
  return {
    type: types.FORMS_REQUEST,
    name: name,
    page: page,
    params: params
  };
};

var receiveForms = function receiveForms(name, forms) {
  return {
    type: types.FORMS_SUCCESS,
    name: name,
    forms: forms
  };
};

var failForms = function failForms(name, error) {
  return {
    type: types.FORMS_FAILURE,
    name: name,
    error: error
  };
};

var indexForms = exports.indexForms = function indexForms(name) {
  var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var done = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  return function (dispatch, getState) {
    dispatch(requestForms(name, page, params));

    var _selectRoot = (0, _root.selectRoot)(name, getState()),
        limit = _selectRoot.limit,
        query = _selectRoot.query,
        select = _selectRoot.select,
        sort = _selectRoot.sort;

    var formio = new _Formio2.default(_Formio2.default.getProjectUrl() + '/form');
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

    return formio.loadForms({ params: requestParams }).then(function (result) {
      dispatch(receiveForms(name, result));
      done(null, result);
    }).catch(function (error) {
      dispatch(failForms(name, error));
      done(error);
    });
  };
};