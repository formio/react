'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _actions = require('../actions');

var _reducers = require('../reducers');

var _containersContainer = require('../containers/Container');

var _containersContainer2 = _interopRequireDefault(_containersContainer);

var _containersIndex = require('../containers/Index');

var _containersIndex2 = _interopRequireDefault(_containersIndex);

var _containersCreate = require('../containers/Create');

var _containersCreate2 = _interopRequireDefault(_containersCreate);

var _containersEdit = require('../containers/Edit');

var _containersEdit2 = _interopRequireDefault(_containersEdit);

var _containersView = require('../containers/View');

var _containersView2 = _interopRequireDefault(_containersView);

var _containersDelete = require('../containers/Delete');

var _containersDelete2 = _interopRequireDefault(_containersDelete);

var registerResource = function registerResource(name, src, overrides) {
  // Allow overriding of options
  var options = Object.assign({}, {
    Index: {
      container: _containersIndex2['default'],
      mapStateToProps: function mapStateToProps(_ref) {
        var formio = _ref.formio;

        return {
          form: formio[name].form.form,
          submissions: formio[name].submissions.submissions,
          pagination: formio[name].submissions.pagination,
          limit: formio[name].submissions.limit,
          isFetching: formio[name].submissions.isFetching
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        dispatch((0, _actions.fetchForm)(name));
        dispatch((0, _actions.fetchSubmissions)(name));
        return {
          onSortChange: function onSortChange() {},
          onPageChange: function onPageChange(page) {
            dispatch((0, _actions.fetchSubmissions)(name, page));
          },
          onButtonClick: function onButtonClick(button, id) {
            console.log(button, id);
          }
        };
      },
      onEnter: function onEnter(nextState, replace, next) {
        next();
      },
      onLeave: function onLeave(prevState, dispatch) {}
    },
    Create: {
      container: _containersCreate2['default'],
      mapStateToProps: function mapStateToProps(_ref2) {
        var formio = _ref2.formio;

        return {
          form: formio[name].form
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch, state) {
        dispatch((0, _actions.fetchForm)(name));
        return {
          onFormSubmit: function onFormSubmit(submission) {
            state.history.push(name);
          }
        };
      },
      onEnter: function onEnter(nextState, replace, next) {
        next();
      },
      onLeave: function onLeave(prevState) {}
    },
    Container: {
      container: _containersContainer2['default'],
      mapStateToProps: function mapStateToProps(state) {
        return {
          state: state
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        return {
          //dispatch
        };
      },
      onEnter: function onEnter(nextState, replace, dispatch, next) {
        next();
      },
      onLeave: function onLeave(prevState, dispatch) {}
    },
    View: {
      container: _containersView2['default'],
      mapStateToProps: function mapStateToProps(state) {
        return {
          state: state
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        return {
          //dispatch
        };
      },
      onEnter: function onEnter(nextState, replace, dispatch, next) {
        next();
      },
      onLeave: function onLeave(prevState, dispatch) {}
    },
    Edit: {
      container: _containersEdit2['default'],
      mapStateToProps: function mapStateToProps(state) {
        return {
          state: state
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        return {
          //dispatch
        };
      },
      onEnter: function onEnter(nextState, replace, next) {
        next();
      },
      onLeave: function onLeave(prevState, dispatch) {}
    },
    Delete: {
      container: _containersDelete2['default'],
      mapStateToProps: function mapStateToProps(state) {
        return {
          state: state
        };
      },
      mapDispatchToProps: function mapDispatchToProps(dispatch) {
        return {
          //dispatch
        };
      },
      onEnter: function onEnter(nextState, replace, dispatch, next) {
        next();
      },
      onLeave: function onLeave(prevState, dispatch) {}
    }
  }, overrides);

  var connectView = function connectView(view, state, next) {
    next(null, (0, _reactRedux.connect)(options[view].mapStateToProps, options[view].mapDispatchToProps)(options[view].container));
  };

  (0, _reducers.injectReducers)(name, src);

  return {
    Routes: _react2['default'].createElement(
      _reactRouter.Route,
      { path: name },
      _react2['default'].createElement(_reactRouter.IndexRoute, {
        getComponent: function (state, next) {
          connectView('Index', state, next);
        },
        onEnter: options['Index'].onEnter,
        onLeave: options['Index'].onLeave
      }),
      _react2['default'].createElement(_reactRouter.Route, {
        path: 'create',
        getComponent: function (state, next) {
          connectView('Create', state, next);
        },
        onEnter: options['Create'].onEnter,
        onLeave: options['Create'].onLeave
      }),
      _react2['default'].createElement(
        _reactRouter.Route,
        {
          path: name + '/:' + name + 'Id',
          getComponent: function (state, next) {
            connectView('Container', state, next);
          },
          onEnter: function (nextState, replace, next) {
            options['Container'].onEnter(nextState, replace, store.dispatch, next);
          },
          onLeave: function (prevState) {
            options['Container'].onEnter(prevState, store.dispatch);
          }
        },
        _react2['default'].createElement(_reactRouter.IndexRoute, {
          getComponent: function (state, next) {
            connectView('View', state, next);
          },
          onEnter: function (nextState, replace, next) {
            options['View'].onEnter(nextState, replace, store.dispatch, next);
          },
          onLeave: function (prevState) {
            options['View'].onEnter(prevState, store.dispatch);
          }
        }),
        _react2['default'].createElement(_reactRouter.Route, {
          path: 'edit',
          getComponent: function (state, next) {
            connectView('Edit', state, next);
          },
          onEnter: function (nextState, replace, next) {
            options['Edit'].onEnter(nextState, replace, store.dispatch, next);
          },
          onLeave: function (prevState) {
            options['Edit'].onEnter(prevState, store.dispatch);
          }
        }),
        _react2['default'].createElement(_reactRouter.Route, {
          path: 'delete',
          getComponent: function (state, next) {
            connectView('Delete', state, next);
          },
          onEnter: function (nextState, replace, next) {
            options['Delete'].onEnter(nextState, replace, store.dispatch, next);
          },
          onLeave: function (prevState) {
            options['Delete'].onEnter(prevState, store.dispatch);
          }
        })
      )
    )
  };
};

exports.registerResource = registerResource;