import {Component} from 'react';
import formioConnect from '../../../formioConnect';

class ProtectAuth extends Component {
  componentDidMount() {
    const {authenticated, goToState} = this.props;

    if (authenticated) {
      goToState();
    }
  }

  render() {
    if (this.props.authenticated) {
      return this.props.children;
    }
    else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    authenticated: ownProps.formio.auth.selectors.getAuthenticated(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    goToState: () => ownProps.router.go('/' + ownProps.formio.auth.config.anonState)
  };
}

export default formioConnect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectAuth);
