import React from 'react';
import { connect } from 'react-redux';
import { default as storeShape } from 'react-redux/lib/utils/storeShape';
import { propTypes } from 'react-router';
import { deepEqual } from '../util';

export default class extends React.Component {
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
    if (typeof this.init === 'function') {
      this.init(this.store, this.props, this.router);
    }
  }

  componentWillReceiveProps = ({ params }) => {
    // If params have changed we are on a new page.
    if (!deepEqual(params, this.props.params) && typeof this.init === 'function') {
      this.init(this.store, this.props, this.router);
    }
  }

  render = () => {
    const Component = connect(
      this.mapStateToProps,
      // Adds router to the end of mapDispatchToProps.
      (...args) => this.mapDispatchToProps(...args, this.router)
    )(this.container);
    return <Component { ...this.props }></Component>;
  }
}