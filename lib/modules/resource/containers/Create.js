'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Form = require('../../../components/Form');

var _Form2 = _interopRequireDefault(_Form);

var _FormioView2 = require('../../../FormioView');

var _FormioView3 = _interopRequireDefault(_FormioView2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (config) {
  return function (_FormioView) {
    _inherits(Create, _FormioView);

    function Create() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Create);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Create.__proto__ || Object.getPrototypeOf(Create)).call.apply(_ref, [this].concat(args))), _this), _this.component = function (props) {
        var isLoading = props.isLoading,
            form = props.form,
            submission = props.submission,
            hideComponents = props.hideComponents,
            onSubmit = props.onSubmit;

        if (isLoading) {
          return _react2.default.createElement(
            'div',
            null,
            'Loading...'
          );
        }
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'h3',
            null,
            'New ',
            form.title
          ),
          _react2.default.createElement(_Form2.default, { form: form, submission: submission, hideComponents: hideComponents, onSubmit: onSubmit })
        );
      }, _this.mapStateToProps = function (state, ownProps) {
        var resource = _this.formio.resources[config.name];
        var form = resource.selectors.getForm(state);
        var submission = { data: {} };

        config.parents.forEach(function (parent) {
          submission.data[parent] = _this.formio.resources[parent].selectors.getSubmission(state).submission;
        });
        return {
          form: form.form,
          submission: submission,
          hideComponents: config.parents,
          isLoading: form.isFetching
        };
      }, _this.mapDispatchToProps = function (dispatch, ownProps) {
        var resource = _this.formio.resources[config.name];
        return {
          onSubmit: function onSubmit(submission) {
            dispatch(resource.actions.submission.save(submission));
            _this.router.push(resource.getBasePath(ownProps.params) + config.name + '/' + submission._id);
          }
        };
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Create;
  }(_FormioView3.default);
};