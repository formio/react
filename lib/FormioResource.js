'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioResource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _providers = require('./providers');

var _Formio = require('./Formio');

var _FormioGrid = require('./FormioGrid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormioResource = exports.FormioResource = function () {
  function FormioResource(name, src) {
    var _this = this;

    var base = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

    _classCallCheck(this, FormioResource);

    this.getContainer = function () {
      return _this.connectComponent({
        container: function container(_ref) {
          var params = _ref.params;

          return _react2.default.createElement(
            'div',
            { className: 'form-container' },
            _react2.default.createElement(
              'h3',
              null,
              'Container'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: _this.base + '/' + _this.name + '/' + params[_this.name + 'Id'] },
              'View'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: _this.base + '/' + _this.name + '/' + params[_this.name + 'Id'] + '/edit' },
              'Edit'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { to: _this.base + '/' + _this.name + '/' + params[_this.name + 'Id'] + '/delete' },
              'Delete'
            ),
            _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id', exactly: true, component: _this.getView() }),
            _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id' + '/edit', exactly: true, component: _this.getEdit() }),
            _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id' + '/delete', exactly: true, component: _this.getDelete() })
          );
        },
        mapStatetoProps: function mapStatetoProps() {
          return {};
        },
        mapDispatchToProps: function mapDispatchToProps() {
          return {};
        }
      });
    };

    this.getIndex = function () {
      return _this.connectComponent({
        container: function container(_ref2) {
          var form = _ref2.form;
          var submissions = _ref2.submissions;
          var pagination = _ref2.pagination;
          var limit = _ref2.limit;
          var isFetching = _ref2.isFetching;
          var onSortChange = _ref2.onSortChange;
          var onPageChange = _ref2.onPageChange;
          var onButtonClick = _ref2.onButtonClick;

          if (isFetching) {
            return _react2.default.createElement(
              'div',
              { className: 'form-index' },
              'Loading...'
            );
          } else {
            return _react2.default.createElement(
              'div',
              { className: 'form-index' },
              _react2.default.createElement(_FormioGrid.FormioGrid, {
                submissions: submissions,
                form: form,
                onSortChange: onSortChange,
                onPageChange: onPageChange,
                pagination: pagination,
                limit: limit,
                onButtonClick: onButtonClick
              })
            );
          }
        },
        mapStateToProps: function mapStateToProps(_ref3) {
          var formio = _ref3.formio;

          return {
            form: formio[_this.name].form.form,
            submissions: formio[_this.name].submissions.submissions,
            pagination: formio[_this.name].submissions.pagination,
            limit: formio[_this.name].submissions.limit,
            isFetching: formio[_this.name].submissions.isFetching
          };
        },
        mapDispatchToProps: function mapDispatchToProps(dispatch, ownProps, router) {
          dispatch((0, _actions.fetchForm)(_this.name));
          dispatch((0, _actions.fetchSubmissions)(_this.name));
          return {
            onSortChange: function onSortChange() {},
            onPageChange: function onPageChange(page) {
              dispatch((0, _actions.fetchSubmissions)(_this.name, page));
            },
            onButtonClick: function onButtonClick(button, id) {
              switch (button) {
                case 'row':
                case 'view':
                  router.transitionTo(_this.base + '/' + _this.name + '/' + id + '/view');
                  break;
                case 'edit':
                  router.transitionTo(_this.base + '/' + _this.name + '/' + id + '/edit');
                  break;
                case 'delete':
                  router.transitionTo(_this.base + '/' + _this.name + '/' + id + '/delete');
                  break;
              }
            }
          };
        }
      });
    };

    this.getCreate = function () {
      return _this.connectComponent({
        container: function container(_ref4) {
          var form = _ref4.form;
          var onFormSubmit = _ref4.onFormSubmit;

          if (form.isFetching || !form.form) {
            return _react2.default.createElement(
              'div',
              { className: 'form-create' },
              'Loading...'
            );
          } else {
            return _react2.default.createElement(
              'div',
              { className: 'form-create' },
              _react2.default.createElement(_Formio.Formio, { src: form.src, form: form.form, onFormSubmit: onFormSubmit })
            );
          }
        },
        mapStateToProps: function mapStateToProps(_ref5) {
          var formio = _ref5.formio;

          return {
            form: formio[_this.name].form
          };
        },
        mapDispatchToProps: function mapDispatchToProps(dispatch, state) {
          dispatch((0, _actions.fetchForm)(_this.name));
          return {
            onFormSubmit: function onFormSubmit(submission) {
              state.history.push(_this.name);
            }
          };
        }
      });
    };

    this.getView = function () {
      return _this.connectComponent({
        container: function container() {
          //<Formio src="currentResource.submissionUrl" read-only="true"/>
          return _react2.default.createElement(
            'div',
            { className: 'form-view' },
            'View'
          );
        },
        mapStateToProps: function mapStateToProps(state) {
          return {
            state: state
          };
        },
        mapDispatchToProps: function mapDispatchToProps(dispatch) {
          return {
            //dispatch
          };
        }
      });
    };

    this.getEdit = function () {
      return _this.connectComponent({
        container: function container() {
          return _react2.default.createElement(
            'div',
            { className: 'form-edit' },
            'Edit'
          );
        },
        mapStateToProps: function mapStateToProps(state) {
          return {
            state: state
          };
        },
        mapDispatchToProps: function mapDispatchToProps(dispatch) {
          return {
            //dispatch
          };
        }
      });
    };

    this.getDelete = function () {
      return _this.connectComponent({
        container: function container() {
          return _react2.default.createElement(
            'div',
            { className: 'form-delete' },
            'Delete!'
          );
        },
        mapStateToProps: function mapStateToProps(state) {
          return {
            state: state
          };
        },
        mapDispatchToProps: function mapDispatchToProps(dispatch) {
          return {
            //dispatch
          };
        }
      });
    };

    this.getRoutes = function () {
      return _react2.default.createElement(
        'div',
        { className: _this.name },
        _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name, exactly: true, component: _this.getIndex() }),
        _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + 'Create', exactly: true, component: _this.getCreate() }),
        _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id', component: _this.getContainer() })
      );
    };

    this.name = name;
    this.src = src;
    this.base = base;

    (0, _providers.injectReducers)(name, src);
    (0, _providers.injectRoute)(this.getRoutes());
  }

  _createClass(FormioResource, [{
    key: 'connectComponent',
    value: function connectComponent(component) {
      var _class, _temp;

      return _temp = _class = function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props, context) {
          _classCallCheck(this, _class);

          var _this2 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

          _this2.render = function () {
            var Connected = (0, _reactRedux.connect)(component.mapStateToProps,
            // Adds router to the end of mapDispatchToProps.
            function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return component.mapDispatchToProps.apply(component, args.concat([_this2.router]));
            })(component.container);
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Connected, null)
            );
          };

          _this2.router = context.router;
          return _this2;
        }

        return _class;
      }(_react2.default.Component), _class.contextTypes = {
        router: _reactRouter.propTypes.routerContext
      }, _temp;
    }
  }, {
    key: 'old',
    value: function old(component) {
      return (0, _reactRedux.connect)(component.mapStateToProps, component.mapDispatchToProps)(component.container);
    }
  }]);

  return FormioResource;
}();