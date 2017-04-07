import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import inputMixin from './mixins/inputMixin';
import componentMixin from './mixins/componentMixin';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

module.exports = React.createClass({
  displayName: 'Currency',
  mixins: [inputMixin, valueMixin, multiMixin, componentMixin],
  customMask: createNumberMask({
    prefix: '',
    allowDecimal: true,
    allowNegative: true
  })
});
