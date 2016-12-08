import React from 'react';
import Input from 'react-input-mask';
import { deepEqual } from '../../../util';

module.exports = {
  shouldComponentUpdate: function(nextProps, nextState) {
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
    if (!deepEqual(this.props.component, nextProps.component)) {
      return true;
    }

    return false;
  }
};
