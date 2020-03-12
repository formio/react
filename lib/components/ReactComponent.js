'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Field2 = require('formiojs/components/_classes/field/Field');

var _Field3 = _interopRequireDefault(_Field2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactComponent = function (_Field) {
  _inherits(ReactComponent, _Field);

  /**
   * This is the first phase of component building where the component is instantiated.
   *
   * @param component - The component definition created from the settings form.
   * @param options - Any options passed into the renderer.
   * @param data - The submission data where this component's data exists.
   */
  function ReactComponent(component, options, data) {
    _classCallCheck(this, ReactComponent);

    var _this = _possibleConstructorReturn(this, (ReactComponent.__proto__ || Object.getPrototypeOf(ReactComponent)).call(this, component, options, data));

    _this.updateValue = function (value, flags) {
      flags = flags || {};
      var newValue = value === undefined || value === null ? _this.getValue() : value;
      var changed = newValue !== undefined ? _this.hasChanged(newValue, _this.dataValue) : false;
      _this.dataValue = Array.isArray(newValue) ? [].concat(_toConsumableArray(newValue)) : newValue;

      _this.updateOnChange(flags, changed);
      return changed;
    };

    return _this;
  }

  /**
   * This method is called any time the component needs to be rebuilt. It is most frequently used to listen to other
   * components using the this.on() function.
   */


  _createClass(ReactComponent, [{
    key: 'init',
    value: function init() {
      return _get(ReactComponent.prototype.__proto__ || Object.getPrototypeOf(ReactComponent.prototype), 'init', this).call(this);
    }

    /**
     * This method is called before the component is going to be destroyed, which is when the component instance is
     * destroyed. This is different from detach which is when the component instance still exists but the dom instance is
     * removed.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      return _get(ReactComponent.prototype.__proto__ || Object.getPrototypeOf(ReactComponent.prototype), 'destroy', this).call(this);
    }

    /**
     * The second phase of component building where the component is rendered as an HTML string.
     *
     * @returns {string} - The return is the full string of the component
     */

  }, {
    key: 'render',
    value: function render() {
      // For react components, we simply render as a div which will become the react instance.
      // By calling super.render(string) it will wrap the component with the needed wrappers to make it a full component.
      return _get(ReactComponent.prototype.__proto__ || Object.getPrototypeOf(ReactComponent.prototype), 'render', this).call(this, '<div ref="react-' + this.id + '"></div>');
    }

    /**
     * The third phase of component building where the component has been attached to the DOM as 'element' and is ready
     * to have its javascript events attached.
     *
     * @param element
     * @returns {Promise<void>} - Return a promise that resolves when the attach is complete.
     */

  }, {
    key: 'attach',
    value: function attach(element) {
      _get(ReactComponent.prototype.__proto__ || Object.getPrototypeOf(ReactComponent.prototype), 'attach', this).call(this, element);

      // The loadRefs function will find all dom elements that have the "ref" setting that match the object property.
      // It can load a single element or multiple elements with the same ref.
      this.loadRefs(element, _defineProperty({}, 'react-' + this.id, 'single'));

      if (this.refs['react-' + this.id]) {
        this.reactInstance = this.attachReact(this.refs['react-' + this.id]);
        if (this.shouldSetValue) {
          this.setValue(this.dataForSetting);
          this.updateValue(this.dataForSetting);
        }
      }
      return Promise.resolve();
    }

    /**
     * The fourth phase of component building where the component is being removed from the page. This could be a redraw
     * or it is being removed from the form.
     */

  }, {
    key: 'detach',
    value: function detach() {
      if (this.refs['react-' + this.id]) {
        this.detachReact(this.refs['react-' + this.id]);
      }
      _get(ReactComponent.prototype.__proto__ || Object.getPrototypeOf(ReactComponent.prototype), 'detach', this).call(this);
    }

    /**
     * Override this function to insert your custom component.
     *
     * @param element
     */

  }, {
    key: 'attachReact',
    value: function attachReact(element) {
      return;
    }

    /**
     * Override this function.
     */

  }, {
    key: 'detachReact',
    value: function detachReact(element) {
      return;
    }

    /**
     * Something external has set a value and our component needs to be updated to reflect that. For example, loading a submission.
     *
     * @param value
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      if (this.reactInstance) {
        this.reactInstance.setState({
          value: value
        });
        this.shouldSetValue = false;
      } else {
        this.shouldSetValue = true;
        this.dataForSetting = value;
      }
    }

    /**
     * The user has changed the value in the component and the value needs to be updated on the main submission object and other components notified of a change event.
     *
     * @param value
     */

  }, {
    key: 'getValue',


    /**
     * Get the current value of the component. Should return the value set in the react component.
     *
     * @returns {*}
     */
    value: function getValue() {
      if (this.reactInstance) {
        return this.reactInstance.state.value;
      }
      return this.defaultValue;
    }

    /**
     * Override normal validation check to insert custom validation in react component.
     *
     * @param data
     * @param dirty
     * @param rowData
     * @returns {boolean}
     */

  }, {
    key: 'checkValidity',
    value: function checkValidity(data, dirty, rowData) {
      var valid = _get(ReactComponent.prototype.__proto__ || Object.getPrototypeOf(ReactComponent.prototype), 'checkValidity', this).call(this, data, dirty, rowData);
      if (!valid) {
        return false;
      }
      return this.validate(data, dirty, rowData);
    }

    /**
     * Do custom validation.
     *
     * @param data
     * @param dirty
     * @param rowData
     * @returns {boolean}
     */

  }, {
    key: 'validate',
    value: function validate(data, dirty, rowData) {
      return true;
    }
  }]);

  return ReactComponent;
}(_Field3.default);

exports.default = ReactComponent;