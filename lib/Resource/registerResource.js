'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResource = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _actions = require('../actions');

var _reducers = require('../reducers');

var _Container = require('../containers/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Index = require('../containers/Index');

var _Index2 = _interopRequireDefault(_Index);

var _Create = require('../containers/Create');

var _Create2 = _interopRequireDefault(_Create);

var _Edit = require('../containers/Edit');

var _Edit2 = _interopRequireDefault(_Edit);

var _View = require('../containers/View');

var _View2 = _interopRequireDefault(_View);

var _Delete = require('../containers/Delete');

var _Delete2 = _interopRequireDefault(_Delete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registerResource = function registerResource(name, src, overrides) {
  // Allow overriding of options
  var options = Object.assign({}, {
    Index: {
      container: _Index2.default
    },
    Create: {
      container: _Create2.default
    },
    Container: {
      container: _Container2.default,
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
    },
    View: {
      container: _View2.default,
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
    },
    Edit: {
      container: _Edit2.default,
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
    },
    Delete: {
      container: _Delete2.default,
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
    }
  }, overrides);

  var connectView = function connectView(view, state, next) {
    next(null, (0, _reactRedux.connect)(options[view].mapStateToProps, options[view].mapDispatchToProps)(options[view].container));
  };

  (0, _reducers.injectReducers)(name, src);

  return {
    Routes: _react2.default.createElement(
      _reactRouter.Route,
      { path: name },
      _react2.default.createElement(_reactRouter.IndexRoute, {
        getComponent: function getComponent(state, next) {
          connectView('Index', state, next);
        }
      }),
      _react2.default.createElement(_reactRouter.Route, {
        path: 'create',
        getComponent: function getComponent(state, next) {
          connectView('Create', state, next);
        }
      }),
      _react2.default.createElement(
        _reactRouter.Route,
        {
          path: name + '/:' + name + 'Id',
          getComponent: function getComponent(state, next) {
            connectView('Container', state, next);
          },
          onEnter: function onEnter(nextState, replace, next) {
            options['Container'].onEnter(nextState, replace, store.dispatch, next);
          },
          onLeave: function onLeave(prevState) {
            options['Container'].onEnter(prevState, store.dispatch);
          }
        },
        _react2.default.createElement(_reactRouter.IndexRoute, {
          getComponent: function getComponent(state, next) {
            connectView('View', state, next);
          }
        }),
        _react2.default.createElement(_reactRouter.Route, {
          path: 'edit',
          getComponent: function getComponent(state, next) {
            connectView('Edit', state, next);
          }
        }),
        _react2.default.createElement(_reactRouter.Route, {
          path: 'delete',
          getComponent: function getComponent(state, next) {
            connectView('Delete', state, next);
          }
        })
      )
    )
  };
};

exports.registerResource = registerResource;