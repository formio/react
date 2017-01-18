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

var _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class(props) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

    _this.state = {
      pagination: _this.props.pagination
    };
    return _this;
  }

  _createClass(_class, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.pagination.page !== this.props.pagination.page) {
        this.setState({
          pagination: {
            page: nextProps.pagination.page
          }
        });
      }
      if (nextProps.pagination.numPages !== this.props.pagination.numPages) {
        this.setState({
          pagination: {
            numPages: nextProps.pagination.numPages
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var pagination = this.state.pagination;

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
      var segments = _.clone((0, _segmentize2.default)({
        page: parseInt(pagination.page) + 1,
        pages: parseInt(pagination.numPages),
        beginPages: 3,
        endPages: 3,
        sidePages: 2
      }));
      // Fixes a bug in Pagify.Segment or segmentize.
      if (!segments.centerPage[0]) {
        segments.centerPage = [];
      }
      return _react2.default.createElement(
        'div',
        { className: 'paging' },
        _react2.default.createElement(
          _reactPagify2.default.Context,
          _extends({}, bootstrapStyles, {
            segments: segments,
            onSelect: this.props.onSelect
          }),
          _react2.default.createElement(
            _reactPagify2.default.Button,
            { page: pagination.page - 1 },
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
            { page: pagination.page + 1 },
            'Next'
          )
        )
      );
    }
  }]);

  return _class;
}(_react2.default.Component);

_class.propTypes = {
  onSelect: _react2.default.PropTypes.func
};
exports.default = _class;