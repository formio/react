import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {connect} from 'react-redux';
import {fetchForm, fetchSubmission, fetchSubmissions} from '../actions';
import {injectReducers} from '../reducers';
import Container from '../containers/Container';
import Index from '../containers/Index';
import Create from '../containers/Create';
import Edit from '../containers/Edit';
import View from '../containers/View';
import Delete from '../containers/Delete';

const registerResource = (name, src, overrides) => {
  // Allow overriding of options
  const options = Object.assign({}, {
    Index: {
      container: Index,
      mapStateToProps: ({formio}) => {
        return {
          form: formio[name].form.form,
          submissions: formio[name].submissions.submissions,
          pagination: formio[name].submissions.pagination,
          limit: formio[name].submissions.limit,
          isFetching: formio[name].submissions.isFetching
        };
      },
      mapDispatchToProps: (dispatch) => {
        dispatch(fetchForm(name));
        dispatch(fetchSubmissions(name));
        return {
          onSortChange: () => {},
          onPageChange: (page) => {
            dispatch(fetchSubmissions(name, page));
          },
          onButtonClick: (button, id) => {
            console.log(button, id);
          }
        };
      },
      onEnter: (nextState, replace, next) => {
        next();
      },
      onLeave: (prevState, dispatch) => {
      }
    },
    Create: {
      container: Create,
      mapStateToProps: ({formio}) => {
        return {
          form: formio[name].form
        };
      },
      mapDispatchToProps: (dispatch, state) => {
        dispatch(fetchForm(name));
        return {
          onFormSubmit: submission => {
            state.history.push(name);
          }
        };
      },
      onEnter: (nextState, replace, next) => {
        next();
      },
      onLeave: (prevState) => {
      }
    },
    Container: {
      container: Container,
      mapStateToProps: (state) => {
        return {
          state
        };
      },
      mapDispatchToProps: (dispatch) => {
        return {
          //dispatch
        };
      },
      onEnter: (nextState, replace, dispatch, next) => {
        next();
      },
      onLeave: (prevState, dispatch) => {
      }
    },
    View: {
      container: View,
      mapStateToProps: (state) => {
        return {
          state
        };
      },
      mapDispatchToProps: (dispatch) => {
        return {
          //dispatch
        };
      },
      onEnter: (nextState, replace, dispatch, next) => {
        next();
      },
      onLeave: (prevState, dispatch) => {
      }
    },
    Edit: {
      container: Edit,
      mapStateToProps: (state) => {
        return {
          state
        };
      },
      mapDispatchToProps: (dispatch) => {
        return {
          //dispatch
        };
      },
      onEnter: (nextState, replace, next) => {
        next();
      },
      onLeave: (prevState, dispatch) => {
      }
    },
    Delete: {
      container: Delete,
      mapStateToProps: (state) => {
        return {
          state
        };
      },
      mapDispatchToProps: (dispatch) => {
        return {
          //dispatch
        };
      },
      onEnter: (nextState, replace, dispatch, next) => {
        next();
      },
      onLeave: (prevState, dispatch) => {
      }
    },
  }, overrides);

  const connectView = (view, state, next) => {
    next(null, connect(
      options[view].mapStateToProps,
      options[view].mapDispatchToProps
    )(options[view].container));
  };

  injectReducers(name, src);

  return {
    Routes:
      <Route path={name}>
        <IndexRoute
          getComponent={(state, next) => {
            connectView('Index', state, next);
          }}
          onEnter={options['Index'].onEnter}
          onLeave={options['Index'].onLeave}
        />
        <Route
          path="create"
          getComponent={(state, next) => {
            connectView('Create', state, next);
          }}
          onEnter={options['Create'].onEnter}
          onLeave={options['Create'].onLeave}
        />
        <Route
          path={name + '/:' + name + 'Id'}
          getComponent={(state, next) => {
            connectView('Container', state, next);
          }}
          onEnter={(nextState, replace, next) => {
            options['Container'].onEnter(nextState, replace, store.dispatch, next);
          }}
          onLeave={(prevState) => {
            options['Container'].onEnter(prevState, store.dispatch);
          }}
        >
          <IndexRoute
            getComponent={(state, next) => {
              connectView('View', state, next);
            }}
            onEnter={(nextState, replace, next) => {
              options['View'].onEnter(nextState, replace, store.dispatch, next);
            }}
            onLeave={(prevState) => {
              options['View'].onEnter(prevState, store.dispatch);
            }}
          />
          <Route
            path="edit"
            getComponent={(state, next) => {
              connectView('Edit', state, next);
            }}
            onEnter={(nextState, replace, next) => {
              options['Edit'].onEnter(nextState, replace, store.dispatch, next);
            }}
            onLeave={(prevState) => {
              options['Edit'].onEnter(prevState, store.dispatch);
            }}
          />
          <Route
            path="delete"
            getComponent={(state, next) => {
              connectView('Delete', state, next);
            }}
            onEnter={(nextState, replace, next) => {
              options['Delete'].onEnter(nextState, replace, store.dispatch, next);
            }}
            onLeave={(prevState) => {
              options['Delete'].onEnter(prevState, store.dispatch);
            }}
          />
        </Route>
      </Route>
  };
};

export {registerResource};