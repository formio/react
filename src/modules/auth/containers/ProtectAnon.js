import {Component} from 'react';
import formioConnect from '../../../formioConnect';

class ProtectAnon extends Component {
  componentDidMount() {
    const { isLoggedIn, history } = this.props;

    if (isLoggedIn) {
      console.log('going home');
      history.replace('/');
    }
  }

  render() {
    if (!this.props.isLoggedIn) {
      return this.props.children;
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: false,
    history: ownProps.history
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default formioConnect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectAnon)