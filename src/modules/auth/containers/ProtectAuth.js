import {Component} from 'react';
import formioConnect from '../../../formioConnect';

class ProtectAuth extends Component {
  componentDidMount() {
    const { isLoggedIn, history } = this.props;

    if (!isLoggedIn) {
      console.log('going to login');
      history.replace("/auth/login");
    }
  }

  render() {
    if (this.props.isLoggedIn) {
      return this.props.children;
    } else {
      return null;
    }
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
)(ProtectAuth)