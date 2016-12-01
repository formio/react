import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import inputMixin from './mixins/inputMixin';
import componentMixin from './mixins/componentMixin';

module.exports = React.createClass({
  displayName: 'Textfield',
  mixins: [valueMixin, multiMixin, inputMixin, componentMixin]
});
