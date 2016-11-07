'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (builder) {
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
        var loading = _ref2.loading,
            forms = _ref2.forms;

        if (loading) {
          return _react2.default.createElement(
            'div',
            { className: 'formio-builder' },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-refresh glyphicon-spin', style: { fontSize: '2em' } }),
            ' Loading'
          );
        }
        return _react2.default.createElement(
          'div',
          { className: 'formio-builder' },
          _react2.default.createElement(
            _reactRouter.Link,
            { to: builder.options.base + '/forms/create', className: 'btn btn-primary' },
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-plus' }),
            ' Create Form'
          ),
          _react2.default.createElement(
            'table',
            { className: 'table table-striped', style: { marginTop: '20px' } },
            _react2.default.createElement(
              'tbody',
              null,
              forms.map(function (form, index) {
                return _react2.default.createElement(
                  'tr',
                  { key: index },
                  _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                      'div',
                      { className: 'row' },
                      _react2.default.createElement(
                        'div',
                        { className: 'col-sm-8' },
                        _react2.default.createElement(
                          _reactRouter.Link,
                          { to: builder.options.base + '/form/' + form._id + '' },
                          _react2.default.createElement(
                            'h5',
                            null,
                            form.title
                          )
                        )
                      ),
                      _react2.default.createElement(
                        'div',
                        { className: 'col-sm-4' },
                        _react2.default.createElement(
                          'div',
                          { className: 'button-group pull-right', style: { display: 'flex' } },
                          _react2.default.createElement(
                            _reactRouter.Link,
                            { to: builder.options.base + '/form/' + form._id, className: 'btn btn-default btn-xs' },
                            _react2.default.createElement('span', { className: 'glyphicon glyphicon-pencil' }),
                            ' Enter Data'
                          ),
                          '\xA0',
                          _react2.default.createElement(
                            _reactRouter.Link,
                            { to: builder.options.base + '/form/' + form._id + '/submission', className: 'btn btn-default btn-xs' },
                            _react2.default.createElement('span', { className: 'glyphicon glyphicon-list-alt' }),
                            ' View Data'
                          ),
                          '\xA0',
                          _react2.default.createElement(
                            _reactRouter.Link,
                            { to: builder.options.base + '/form/' + form._id + '/edit', className: 'btn btn-default btn-xs' },
                            _react2.default.createElement('span', { className: 'glyphicon glyphicon-edit' }),
                            ' Edit Form'
                          ),
                          '\xA0',
                          _react2.default.createElement(
                            _reactRouter.Link,
                            { to: builder.options.base + '/form/' + form._id + '/delete', className: 'btn btn-default btn-xs' },
                            _react2.default.createElement('span', { className: 'glyphicon glyphicon-trash' })
                          )
                        )
                      )
                    )
                  )
                );
              })
            )
          )
        );
      }, _this.initialize = function (_ref3) {
        var dispatch = _ref3.dispatch;

        dispatch(_actions.FormActions.index(builder.key, builder.options.tag));
      }, _this.mapStateToProps = function (_ref4) {
        var formio = _ref4.formio;

        return {
          loading: formio[builder.key].forms.isFetching,
          forms: formio[builder.key].forms.forms
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

var _reactRouter = require('react-router');

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }