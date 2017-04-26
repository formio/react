import React from 'react';
import valueMixin from './mixins/valueMixin';
import inputMixin from './mixins/inputMixin';
import multiMixin from './mixins/multiMixin';
import componentMixin from './mixins/componentMixin';

module.exports = React.createClass({
  displayName: 'Number',
  mixins: [valueMixin, multiMixin, componentMixin, inputMixin]
});
