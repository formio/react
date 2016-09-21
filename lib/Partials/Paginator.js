'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPagify = require('react-pagify');

var _reactPagify2 = _interopRequireDefault(_reactPagify);

var _segmentize = require('segmentize');

var _segmentize2 = _interopRequireDefault(_segmentize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Paginator = function (_React$Component) {
  _inherits(Paginator, _React$Component);

  function Paginator(props) {
    _classCallCheck(this, Paginator);

    var _this = _possibleConstructorReturn(this, (Paginator.__proto__ || Object.getPrototypeOf(Paginator)).call(this, props));

    _this.state = {
      paginationPage: _this.props.paginationPage,
      paginationNumPages: _this.props.paginationNumPages
    };
    return _this;
  }

  _createClass(Paginator, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.paginationPage !== this.props.paginationPage) {
        this.setState({
          paginationPage: nextProps.paginationPage
        });
      }
      if (nextProps.paginationNumPages !== this.props.paginationNumPages) {
        this.setState({
          paginationNumPages: nextProps.paginationNumPages
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var paginationPage = this.state.paginationPage;
      var paginationNumPages = this.state.paginationNumPages;
      var bootstrapStyles = {
        className: 'pagination',
        tags: {
          container: {
            tag: 'ul'
          },
          segment: {
            tag: 'li'
          },
          ellipsis: {
            tag: 'li',
            props: {
              className: 'disabled',
              children: _react2.default.createElement('span', null, '…')
            }
          },
          link: {
            tag: 'a'
          }
        }
      };
      return _react2.default.createElement(
        'div',
        { className: 'paging' },
        _react2.default.createElement(
          _reactPagify2.default.Context,
          _extends({}, bootstrapStyles, {
            segments: (0, _segmentize2.default)({
              page: parseInt(paginationPage) + 1,
              pages: parseInt(paginationNumPages),
              beginPages: 3,
              endPages: 3,
              sidePages: 2
            }), onSelect: this.props.onSelect
          }),
          _react2.default.createElement(
            _reactPagify2.default.Button,
            { page: paginationPage - 1 },
            'Previous'
          ),
          _react2.default.createElement(_reactPagify2.default.Segment, { field: 'beginPages' }),
          _react2.default.createElement(_reactPagify2.default.Ellipsis, {
            className: 'ellipsis',
            previousField: 'beginPages',
            nextField: 'previousPages'
          }),
          _react2.default.createElement(_reactPagify2.default.Segment, { field: 'previousPages' }),
          _react2.default.createElement(_reactPagify2.default.Segment, { field: 'centerPage' }),
          _react2.default.createElement(_reactPagify2.default.Segment, { field: 'nextPages' }),
          _react2.default.createElement(_reactPagify2.default.Ellipsis, {
            className: 'ellipsis',
            previousField: 'nextPages',
            nextField: 'endPages'
          }),
          _react2.default.createElement(_reactPagify2.default.Segment, { field: 'endPages' }),
          _react2.default.createElement(
            _reactPagify2.default.Button,
            { page: paginationPage + 1 },
            'Next'
          )
        )
      );
    }
  }]);

  return Paginator;
}(_react2.default.Component);

Paginator.propTypes = {
  paginationPage: _react2.default.PropTypes.number,
  paginationNumPages: _react2.default.PropTypes.number,
  onSelect: _react2.default.PropTypes.func
};

exports.default = Paginator;