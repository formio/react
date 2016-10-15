'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _redux = require('redux');

var _components = require('../components');

var _FormioProvider2 = require('./FormioProvider');

var _FormioProvider3 = _interopRequireDefault(_FormioProvider2);

var _actions = require('../actions');

var _reducers = require('../reducers');

var _factories = require('../factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_FormioProvider) {
  _inherits(_class, _FormioProvider);

  function _class(name, src) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, name, src, options));

    _initialiseProps.call(_this);

    _this.name = name;
    _this.src = src;
    _this.options = options;
    _this.options.base = _this.options.base || '';

    (0, _factories.addReducer)(name, _this.getReducers(name, src));
    (0, _factories.addRoute)(_this.getRoutes());
    return _this;
  }

  return _class;
}(_FormioProvider3.default);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.basePath = function () {
    return _this2.options.base + '/' + _this2.name;
  };

  this.Container = function () {
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
                { to: _this2.basePath() + '/' + params[_this2.name + 'Id'] },
                'View'
              )
            ),
            _react2.default.createElement(
              'li',
              { role: 'presentation' },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _this2.basePath() + '/' + params[_this2.name + 'Id'] + '/edit' },
                'Edit'
              )
            ),
            _react2.default.createElement(
              'li',
              { role: 'presentation' },
              _react2.default.createElement(
                _reactRouter.Link,
                { to: _this2.basePath() + '/' + params[_this2.name + 'Id'] + '/delete' },
                'Delete'
              )
            )
          ),
          _react2.default.createElement(_reactRouter.Match, { pattern: _this2.basePath() + '/:' + _this2.name + 'Id', exactly: true, component: _this2.View() }),
          _react2.default.createElement(_reactRouter.Match, { pattern: _this2.basePath() + '/:' + _this2.name + 'Id' + '/edit', exactly: true, component: _this2.Edit() }),
          _react2.default.createElement(_reactRouter.Match, { pattern: _this2.basePath() + '/:' + _this2.name + 'Id' + '/delete', exactly: true, component: _this2.Delete() })
        );
      },
      mapStateToProps: function mapStateToProps(_ref2) {
        var formio = _ref2.formio;

        return {
          title: formio[_this2.name].form.form.title
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        dispatch(_actions.FormActions.fetch(_this2.name));
        dispatch(_actions.SubmissionActions.fetch(_this2.name, params[_this2.name + 'Id']));
        return {};
      }
    });
  };

  this.Index = function () {
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
            _react2.default.createElement(
              'h3',
              null,
              form.title,
              's'
            ),
            _react2.default.createElement(
              _reactRouter.Link,
              { className: 'btn btn-success', to: _this2.basePath() + 'Create' },
              _react2.default.createElement('i', { className: 'glyphicon glyphicon-plus', 'aria-hidden': 'true' }),
              ' New ',
              form.title
            ),
            _react2.default.createElement(_components.FormioGrid, {
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
                router.transitionTo(_this2.basePath() + '/' + id);
                break;
              case 'edit':
                router.transitionTo(_this2.basePath() + '/' + id + '/edit');
                break;
              case 'delete':
                router.transitionTo(_this2.basePath() + '/' + id + '/delete');
                break;
            }
          }
        };
      }
    });
  };

  this.Create = function () {
    return _this2.connectComponent({
      container: function container(_ref5) {
        var pageTitle = _ref5.pageTitle;
        var form = _ref5.form;
        var onFormSubmit = _ref5.onFormSubmit;

        var element = null;
        if (form.isFetching || !form.form) {
          element = 'Loading...';
        } else {
          element = _react2.default.createElement(_components.Formio, { src: form.src, form: form.form, onFormSubmit: onFormSubmit });
        }
        return _react2.default.createElement(
          'div',
          { className: 'form-create' },
          _react2.default.createElement(
            'h3',
            null,
            pageTitle
          ),
          element
        );
      },
      mapStateToProps: function mapStateToProps(_ref6) {
        var formio = _ref6.formio;

        return {
          form: formio[_this2.name].form,
          pageTitle: 'New ' + (formio[_this2.name].form.form.title || '')
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, ownProps, router) {
        dispatch(_actions.FormActions.fetch(_this2.name));
        return {
          onFormSubmit: function onFormSubmit(submission) {
            router.transitionTo(_this2.basePath() + '/' + submission._id);
          }
        };
      }
    });
  };

  this.View = function () {
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
            _react2.default.createElement(_components.Formio, {
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
      mapDispatchToProps: function mapDispatchToProps() {
        return null;
      }
    });
  };

  this.Edit = function () {
    return _this2.connectComponent({
      container: function container(_ref10) {
        var src = _ref10.src;
        var form = _ref10.form;
        var submission = _ref10.submission;
        var onFormSubmit = _ref10.onFormSubmit;

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
            _react2.default.createElement(_components.Formio, {
              src: src,
              form: form.form,
              submission: submission.submission,
              onFormSubmit: onFormSubmit
            })
          );
        }
      },
      mapStateToProps: function mapStateToProps(_ref11, _ref12) {
        var formio = _ref11.formio;
        var params = _ref12.params;

        return {
          src: formio[_this2.name].form.src + '/submission/' + params[_this2.name + 'Id'],
          form: formio[_this2.name].form,
          submission: formio[_this2.name].submission
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, _ref13, router) {
        var params = _ref13.params;

        return {
          onFormSubmit: function onFormSubmit(submission) {
            router.transitionTo(_this2.basePath() + '/' + submission._id);
          }
        };
      }
    });
  };

  this.Delete = function () {
    return _this2.connectComponent({
      container: function container(_ref14) {
        var title = _ref14.title;
        var onYes = _ref14.onYes;
        var onNo = _ref14.onNo;

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
      },
      mapStateToProps: function mapStateToProps(_ref15) {
        var formio = _ref15.formio;

        return {
          title: formio[_this2.name].form.form.title
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, _ref16, router) {
        var params = _ref16.params;

        return {
          onYes: function onYes() {
            _actions.SubmissionActions.delete(_this2.name, params[_this2.name + 'Id']).then(function () {
              router.transitionTo(_this2.basePath());
            }).catch(function (error) {});
          },
          onNo: function onNo() {
            router.transitionTo(_this2.basePath());
          }
        };
      }
    });
  };

  this.getRoutes = function () {
    return _react2.default.createElement(
      'div',
      { className: _this2.name },
      _react2.default.createElement(_reactRouter.Match, { pattern: _this2.basePath(), exactly: true, component: _this2.Index() }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this2.basePath() + 'Create', exactly: true, component: _this2.Create() }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this2.basePath() + '/:' + _this2.name + 'Id', component: _this2.Container() })
    );
  };

  this.getReducers = function (name, src) {
    return (0, _redux.combineReducers)({
      form: (0, _reducers.formReducer)(name, src),
      submission: (0, _reducers.submissionReducer)(name, src),
      submissions: (0, _reducers.submissionsReducer)(name, src)
    });
  };
};

exports.default = _class;