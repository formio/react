import createReactClass from 'create-react-class';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';
import inputMixin from './mixins/inputMixin';
import componentMixin from './mixins/componentMixin';

module.exports = createReactClass({
  displayName: 'PhoneNumber',
  mixins: [valueMixin, multiMixin, inputMixin, componentMixin]
});
