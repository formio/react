import React, {Component} from 'react';
import formioConnect from '../../../formioConnect';

class Login extends Component {
  render() {
    return <div>Login Form</div>
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: true,
    history: ownProps.history
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default formioConnect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
