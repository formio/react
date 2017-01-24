'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Navigate = exports.Navigate = {
  to: function to(path) {
    return {
      type: 'NAVIGATE',
      location: { pathname: path },
      action: 'PUSH'
    };
  },
  back: function back() {
    return {
      type: 'NAVIGATE',
      action: 'POP' // Is this right?
    };
  }
};