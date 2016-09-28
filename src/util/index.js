import get from 'lodash/get';
import has from 'lodash/has';

function defineTransformerOutsideStrictMode() {
  var safeGlobalName = '____formioSelectMixinGetTransformer';
  var globalObject = typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : {};

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
  (1,eval)('function '+safeGlobalName+' (props) { return function (_, exp) { with(props) { return eval(exp); } } }');

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
export const interpolate = (template, variables) => {
  var transform = getTransformer(variables);
  //find all {{ }} expression blocks and then replace the blocks with their evaluation.
  return template.replace(/\{\s*\{([^\}]*)\}\s*\}/gm, transform);
};

/**
 * This function serializes an object to a queryString.
 * @param obj
 * @returns {string}
 */
export const serialize = obj => {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
};

//helper function to render raw html under a react element.
export const raw = function(html) {
  return {dangerouslySetInnerHTML: {__html: html}};
}

export const fileSize = function(a, b, c, d, e) {
  /* eslint-disable space-before-function-paren */
  return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes');
};

// Resolve nested values within an array.
export const nested = function({ rowData, column }) {
  const { property } = column;

  if (!property) {
    return {};
  }

  if (!has(rowData, property)) {
    //console.warn( // eslint-disable-line no-console
    //  `resolve.nested - Failed to find "${property}" property from`,
    //  rowData
    //);

    return {};
  }

  return {
    ...rowData,
    [property]: get(rowData, property)
  };
}