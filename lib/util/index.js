'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nested = exports.fileSize = exports.raw = exports.serialize = exports.interpolate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _has = require('lodash/has');

var _has2 = _interopRequireDefault(_has);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function defineTransformerOutsideStrictMode() {
  var safeGlobalName = '____formioSelectMixinGetTransformer';
  var globalObject = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

  /* We are essentially doing this, but because we're in strict mode by default in all babeled
   * modules, we need to escape it
   *
   * //string-replace callback, called for every match in the template.
   * function transform (_, expression) {
   *  //bring the properties of 'props' into local scope so that the expression can reference them
   *  with (props) {
   *    return eval(expression); //evaluate the expression.
   *  }
   * }
   */

  //This escapes strict mode.
  (1, eval)('function ' + safeGlobalName + ' (props) { return function (_, exp) { with(props) { return eval(exp); } } }');

  var ret = eval(safeGlobalName);

  //cleanup
  delete globalObject[safeGlobalName];

  return ret;
}

var getTransformer = defineTransformerOutsideStrictMode();

/**
 * This function is intended to mimic the Angular $interpolate function.
 *
 * Since template strings are created using Angular syntax, we need to mimic rendering them to strings. This function
 * will take the template and the associated variables and render it out. It currently does basic compiling but
 * is not full featured compatible with Angular.
 *
 * @param template
 * @param variables
 * @returns {string|XML|*|void}
 */
var interpolate = exports.interpolate = function interpolate(template, variables) {
  var transform = getTransformer(variables);
  //find all {{ }} expression blocks and then replace the blocks with their evaluation.
  return template.replace(/\{\s*\{([^\}]*)\}\s*\}/gm, transform);
};

/**
 * This function serializes an object to a queryString.
 * @param obj
 * @returns {string}
 */
var serialize = exports.serialize = function serialize(obj) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
};

//helper function to render raw html under a react element.
var raw = exports.raw = function raw(html) {
  return { dangerouslySetInnerHTML: { __html: html } };
};

var fileSize = exports.fileSize = function fileSize(a, b, c, d, e) {
  /* eslint-disable space-before-function-paren */
  return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes');
};

// Resolve nested values within an array.
var nested = exports.nested = function nested(_ref) {
  var rowData = _ref.rowData;
  var column = _ref.column;
  var property = column.property;


  if (!property) {
    return {};
  }

  if (!(0, _has2.default)(rowData, property)) {
    //console.warn( // eslint-disable-line no-console
    //  `resolve.nested - Failed to find "${property}" property from`,
    //  rowData
    //);

    return {};
  }

  return _extends({}, rowData, _defineProperty({}, property, (0, _get2.default)(rowData, property)));
};