import React from 'react';
import { connect } from 'react-redux';
import storeShape from 'react-redux/src/utils/storeShape';
import { propTypes } from 'react-router';
import { deepEqual } from '../util';

export default class {
  /**
   * This method does two things.
   *
   * 1. Get the router out of context and add it as an argument to mapDispatchToProps so that we can do router
   *    navigation as a result of functions passed into a Component.
   *
   * 2. Wrap the component using Redux so that mapStateToProps and mapDispatchToProps is called on it.
   *
   * @param component
   * @returns {{contextTypes, new(*=, *=): {render}}}
   */
  connectView(component) {
    return class extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.router = context.router;
        this.store = context.store;
      }

      static contextTypes = {
        router: propTypes.routerContext,
        store: storeShape
      }

      componentWillMount = () => {
        if (typeof component.init === 'function') {
          component.init(this.props, this.store, this.router);
        }
      }

      componentWillReceiveProps = ({ params }) => {
        // If params have changed we are on a new page.
        if (!deepEqual(params, this.props.params) && typeof component.init === 'function') {
          component.init(this.props, this.store, this.router);
        }
      }

      render = () => {
        const Connected = connect(
          component.mapStateToProps,
          // Adds router to the end of mapDispatchToProps.
          (...args) => component.mapDispatchToProps(...args, this.router)
        )(component.container);
        return <Connected { ...this.props }></Connected>;
      }
    }
  }
}
