'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formioConnect = require('../../../formioConnect');

var _formioConnect2 = _interopRequireDefault(_formioConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProtectAnon = function (_Component) {
  _inherits(ProtectAnon, _Component);

  function ProtectAnon() {
    _classCallCheck(this, ProtectAnon);

    return _possibleConstructorReturn(this, (ProtectAnon.__proto__ || Object.getPrototypeOf(ProtectAnon)).apply(this, arguments));
  }

  _createClass(ProtectAnon, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          authenticated = _props.authenticated,
          goToState = _props.goToState;


      if (authenticated) {
        //return <div>Unauthorized</div>;
        goToState();
      } else {
        return this.props.children;
      }
    }
  }]);

  return ProtectAnon;
}(_react.Component);

function mapStateToProps(state, ownProps) {
  return {
    authenticated: ownProps.formio.auth.selectors.getAuthenticated(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    goToState: function goToState() {
      return ownProps.router.go('/' + ownProps.formio.auth.config.authState);
    }
  };
}

exports.default = (0, _formioConnect2.default)(mapStateToProps, mapDispatchToProps)(ProtectAnon);