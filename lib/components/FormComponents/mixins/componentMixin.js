'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('../../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    // If a new value is set within state, re-render.
    if (this.state && this.state.hasOwnProperty('value') && this.state.value !== nextState.value) {
      return true;
    }

    // If the pristineness changes without a value change, re-render.
    if (this.state && this.state.hasOwnProperty('isPristine') && this.state.isPristine !== nextState.isPristine) {
      return true;
    }

    // If a new value is passed in, re-render.
    if (this.props.value !== nextProps.value) {
      return true;
    }

    // If the component definition change, re-render.
    if (!(0, _util.deepEqual)(this.props.component, nextProps.component)) {
      return true;
    }

    // If component has a custom data source, always recalculate
    if (this.props.component.hasOwnProperty('refreshOn') && this.props.component.refreshOn) {
      return true;
    }

    if (this.state && this.state.hasOwnProperty('searchTerm') && this.state.searchTerm !== nextState.searchTerm) {
      return true;
    }

    if (this.state && this.state.hasOwnProperty('selectItems') && !(0, _util.deepEqual)(this.state.selectItems, nextState.selectItems)) {
      return true;
    }

    return false;
  }
};