import React from 'react';
import { connect } from 'react-redux';
import { propTypes } from 'react-router';

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
  connectComponent(component) {
    return class extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.router = context.router;
      }

      static contextTypes = {
        router: propTypes.routerContext
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
