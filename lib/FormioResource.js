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
    value: function connectComponent(Component) {
      return (0, _reactRedux.connect)(Component.mapStateToProps, Component.mapDispatchToProps)(Component.container);
    }
  }]);

  return FormioResource;
}();

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.Container = {
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
        _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id', exactly: true, component: _this.connectComponent(_this.View) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id' + '/edit', exactly: true, component: _this.connectComponent(_this.Edit) }),
        _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id' + '/delete', exactly: true, component: _this.connectComponent(_this.Delete) })
      );
    },
    mapStatetoProps: function mapStatetoProps() {
      return {};
    },
    mapDispatchToProps: function mapDispatchToProps() {
      return {};
    }
  };
  this.Index = {
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
    mapDispatchToProps: function mapDispatchToProps(dispatch) {
      dispatch((0, _actions.fetchForm)(_this.name));
      dispatch((0, _actions.fetchSubmissions)(_this.name));
      return {
        onSortChange: function onSortChange() {},
        onPageChange: function onPageChange(page) {
          dispatch((0, _actions.fetchSubmissions)(_this.name, page));
        },
        onButtonClick: function onButtonClick(button, id) {
          console.log(button, id);
        }
      };
    }
  };
  this.Create = {
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
  };
  this.View = {
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
  };
  this.Edit = {
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
  };
  this.Delete = {
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
  };

  this.getRoutes = function () {
    return _react2.default.createElement(
      'div',
      { className: name },
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name, exactly: true, component: _this.connectComponent(_this.Index) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + 'Create', exactly: true, component: _this.connectComponent(_this.Create) }),
      _react2.default.createElement(_reactRouter.Match, { pattern: _this.base + '/' + _this.name + '/:' + _this.name + 'Id', component: _this.connectComponent(_this.Container) })
    );
  };
};