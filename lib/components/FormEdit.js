'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _components = require('../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class(props) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

    _this.componentWillReceiveProps = function (nextProps) {
      if (_this.state.form !== nextProps.form) {
        _this.setState({
          form: nextProps.form
        });
      }
    };

    _this.render = function () {
      var _this$props = _this.props;
      var onSave = _this$props.onSave;
      var onCancel = _this$props.onCancel;
      var form = _this.state.form;

      var actionTitle = form._id ? 'Save Form' : 'Create Form';
      return _react2.default.createElement(
        'form',
        { role: 'form' },
        _react2.default.createElement(
          'div',
          { id: 'form-group-title', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'title', className: 'control-label' },
            'Title'
          ),
          _react2.default.createElement('input', { type: 'text', value: form.title, className: 'form-control', id: 'title', placeholder: 'Enter the form title' })
        ),
        _react2.default.createElement(
          'div',
          { id: 'form-group-name', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'name', className: 'control-label' },
            'Name'
          ),
          _react2.default.createElement('input', { type: 'text', value: form.name, className: 'form-control', id: 'name', placeholder: 'Enter the form machine name' })
        ),
        _react2.default.createElement(
          'div',
          { id: 'form-group-path', className: 'form-group' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'path', className: 'control-label' },
            'Path'
          ),
          _react2.default.createElement('input', { type: 'text', className: 'form-control', id: 'path', value: form.path, placeholder: 'example', style: { width: '200px', textTransform: 'lowercase' } }),
          _react2.default.createElement(
            'small',
            null,
            'The path alias for this form.'
          )
        ),
        _react2.default.createElement(_components.FormBuilder, { src: 'formUrl' }),
        _react2.default.createElement(
          'div',
          { className: 'form-group pull-right' },
          _react2.default.createElement(
            'a',
            { className: 'btn btn-default', onClick: function onClick() {
                onCancel(form);
              } },
            'Cancel'
          ),
          _react2.default.createElement('input', { type: 'submit', className: 'btn btn-primary', onClick: function onClick() {
              onSave(form);
            }, value: actionTitle })
        )
      );
    };

    _this.state = {
      form: props.form
    };
    return _this;
  }

  return _class;
}(_react2.default.Component);

_class.defaultProps = {
  form: {
    type: 'form'
  },
  onSave: function onSave() {
    return null;
  },
  onCancel: function onCancel() {
    return null;
  }
};
exports.default = _class;