'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (resource) {
  return function (_ReduxView) {
    _inherits(_class2, _ReduxView);

    function _class2() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args))), _this), _this.container = function (_ref2) {
        var title = _ref2.title,
            onYes = _ref2.onYes,
            onNo = _ref2.onNo;

        return _react2.default.createElement(
          'div',
          { className: 'form-delete' },
          _react2.default.createElement(_components.FormioConfirm, {
            message: 'Are you sure you wish to delete the ' + title + '?',
            buttons: [{
              text: 'Yes',
              class: 'btn btn-danger',
              callback: onYes
            }, {
              text: 'No',
              class: 'btn btn-default',
              callback: onNo
            }]
          })
        );
      }, _this.mapStateToProps = function (_ref3) {
        var formio = _ref3.formio;

        return {
          title: formio[resource.name].form.form.title
        };
      }, _this.mapDispatchToProps = function (dispatch, _ref4, router) {
        var params = _ref4.params;

        return {
          onYes: function onYes() {
            _actions.SubmissionActions.delete(resource.name, params[resource.name + 'Id']).then(function () {
              router.transitionTo(resource.basePath());
            }).catch(function (error) {});
          },
          onNo: function onNo() {
            router.transitionTo(resource.basePath());
          }
        };
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return _class2;
  }(_reduxView2.default);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxView = require('redux-view');

var _reduxView2 = _interopRequireDefault(_reduxView);

var _components = require('../../../components');

var _actions = require('../../Formio/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }