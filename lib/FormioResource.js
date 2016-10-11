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
    var base = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

    _classCallCheck(this, FormioResource);

    _initialiseProps.call(this);

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

          var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

          _this.render = function () {
            var Connected = (0, _reactRedux.connect)(component.mapStateToProps,
            // Adds router to the end of mapDispatchToProps.
            function () {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return component.mapDispatchToProps.apply(component, args.concat([_this.router]));
            })(component.container);
            return _react2.default.createElement(Connected, _this.props);
          };

          _this.router = context.router;
          return _this;
        }

        return _class;
      }(_react2.default.Component), _class.contextTypes = {
        router: _reactRouter.propTypes.routerContext
      }, _temp;
    }
  }]);

  return FormioResource;
}();

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.getContainer = function () {
    return _this2.connectComponent({
      container: function container(_ref) {
        var title = _ref.title;
        var params = _ref.params;

        return _react2.default.createElement(
          'div',
          { className: 'form-container' },
          _react2.default.createElement(
            'h2',
            null,
            title
          ),
          _react2.default.createElement(
            'ul',
            { className: 'nav nav-tabs' },
            _react2.default.createElement(
              'li',
              { role: 'presentation' },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _this2.base + '/' + _this2.name + '/' + params[_this2.name + 'Id'] },
                'View'
              )
            ),
            _react2.default.createElement(
              'li',
              { role: 'presentation' },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _this2.base + '/' + _this2.name + '/' + params[_this2.name + 'Id'] + '/edit' },
                'Edit'
              )
            ),
            _react2.default.createElement(
              'li',
              { role: 'presentation' },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _this2.base + '/' + _this2.name + '/' + params[_this2.name + 'Id'] + '/delete' },
                'Delete'
              )
            )
          ),
          _react2.default.createElement(_reactRouter.Match, { pattern: _this2.base + '/' + _this2.name + '/:' + _this2.name + 'Id', exactly: true, component: _this2.getView() }),
          _react2.default.createElement(_reactRouter.Match, { pattern: _this2.base + '/' + _this2.name + '/:' + _this2.name + 'Id' + '/edit', exactly: true, component: _this2.getEdit() }),
          _react2.default.createElement(_reactRouter.Match, { pattern: _this2.base + '/' + _this2.name + '/:' + _this2.name + 'Id' + '/delete', exactly: true, component: _this2.getDelete() })
        );
      },
      mapStatetoProps: function mapStatetoProps(_ref2) {
        var formio = _ref2.formio;

        return {
          title: formio[_this2.name].form.form.title
        };
      },
      mapDispatchToProps: function mapDispatchToProps() {
        return {};
      }
    });
  };

  this.getIndex = function () {
    return _this2.connectComponent({
      container: function container(_ref3) {
        var form = _ref3.form;
        var submissions = _ref3.submissions;
        var pagination = _ref3.pagination;
        var limit = _ref3.limit;
        var isFetching = _ref3.isFetching;
        var onSortChange = _ref3.onSortChange;
        var onPageChange = _ref3.onPageChange;
        var onButtonClick = _ref3.onButtonClick;

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
      mapStateToProps: function mapStateToProps(_ref4) {
        var formio = _ref4.formio;

        return {
          form: formio[_this2.name].form.form,
          submissions: formio[_this2.name].submissions.submissions,
          pagination: formio[_this2.name].submissions.pagination,
          limit: formio[_this2.name].submissions.limit,
          isFetching: formio[_this2.name].submissions.isFetching
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, ownProps, router) {
        dispatch(_actions.FormActions.fetch(_this2.name));
        dispatch(_actions.SubmissionActions.index(_this2.name));
        return {
          onSortChange: function onSortChange() {},
          onPageChange: function onPageChange(page) {
            dispatch(_actions.SubmissionActions.index(_this2.name, page));
          },
          onButtonClick: function onButtonClick(button, id) {
            switch (button) {
              case 'row':
              case 'view':
                router.transitionTo(_this2.base + '/' + _this2.name + '/' + id);
                break;
              case 'edit':
                router.transitionTo(_this2.base + '/' + _this2.name + '/' + id + '/edit');
                break;
              case 'delete':
                router.transitionTo(_this2.base + '/' + _this2.name + '/' + id + '/delete');
                break;
            }
          }
        };
      }
    });
  };

  this.getCreate = function () {
    return _this2.connectComponent({
      container: function container(_ref5) {
        var form = _ref5.form;
        var onFormSubmit = _ref5.onFormSubmit;

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
      mapStateToProps: function mapStateToProps(_ref6) {
        var formio = _ref6.formio;

        return {
          form: formio[_this2.name].form
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, state) {
        dispatch(_actions.FormActions.fetch(_this2.name));
        return {
          onFormSubmit: function onFormSubmit(submission) {
            state.history.push(_this2.name);
          }
        };
      }
    });
  };

  this.getView = function () {
    return _this2.connectComponent({
      container: function container(_ref7) {
        var src = _ref7.src;
        var form = _ref7.form;
        var submission = _ref7.submission;

        if (form.isFetching || !form.form || submission.isFetching || !submission.submission) {
          return _react2.default.createElement(
            'div',
            { className: 'form-view' },
            'Loading...'
          );
        } else {
          return _react2.default.createElement(
            'div',
            { className: 'form-view' },
            _react2.default.createElement(_Formio.Formio, {
              src: src,
              form: form.form,
              submission: submission.submission,
              readOnly: true
            })
          );
        }
      },
      mapStateToProps: function mapStateToProps(_ref8, _ref9) {
        var formio = _ref8.formio;
        var params = _ref9.params;

        return {
          src: formio[_this2.name].form.src + '/submission/' + params[_this2.name + 'Id'],
          form: formio[_this2.name].form,
          submission: formio[_this2.name].submission
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, _ref10, router) {
        var params = _ref10.params;

        dispatch(_actions.FormActions.fetch(_this2.name));
        dispatch(_actions.SubmissionActions.fetch(_this2.name, params[_this2.name + 'Id']));
        return {};
      }
    });
  };

  this.getEdit = function () {
    return _this2.connectComponent({
      container: function container(_ref11) {
        var src = _ref11.src;
        var form = _ref11.form;
        var submission = _ref11.submission;
        var onFormSubmit = _ref11.onFormSubmit;

        if (form.isFetching || !form.form || submission.isFetching || !submission.submission) {
          return _react2.default.createElement(
            'div',
            { className: 'form-view' },
            'Loading...'
          );
        } else {
          return _react2.default.createElement(
            'div',
            { className: 'form-view' },
            _react2.default.createElement(_Formio.Formio, {
              src: src,
              form: form.form,
              submission: submission.submission
            })
          );
        }
      },
      mapStateToProps: function mapStateToProps(_ref12, _ref13) {
        var formio = _ref12.formio;
        var params = _ref13.params;

        return {
          src: formio[_this2.name].form.src + '/submission/' + params[_this2.name + 'Id'],
          form: formio[_this2.name].form,
          submission: formio[_this2.name].submission
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, _ref14, router) {
        var params = _ref14.params;

        dispatch(_actions.FormActions.fetch(_this2.name));
        dispatch(_actions.SubmissionActions.fetch(_this2.name, params[_this2.name + 'Id']));
        return {
          onFormSubmit: function onFormSubmit(error, submission) {}
        };
      }
    });
  };

  this.getDelete = function () {
    return _this2.connectComponent({
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
      { className: _this2.name },
      _react2.default.createElement(_reactRouter.Match, { pattern: _this2.base + '/' + _this2.name, exactly: true, component: _this2.getIndex() }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this2.base + '/' + _this2.name + 'Create', exactly: true, component: _this2.getCreate() }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this2.base + '/' + _this2.name + '/:' + _this2.name + 'Id', component: _this2.getContainer() })
    );
  };
};