import {Component} from 'react';
import {connect} from 'react-redux';

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

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn: true,
    history: ownProps.history
  }
}

export default connect(mapStateToProps)(ProtectAuth)