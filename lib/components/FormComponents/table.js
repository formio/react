'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _components = require('../../components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (_temp = _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'render',
    value: function render() {
      var title = this.props.component.title ? _react2.default.createElement(
        'div',
        { className: 'panel-heading' },
        _react2.default.createElement(
          'h3',
          { className: 'panel-title' },
          this.props.component.title
        )
      ) : '';
      var tableClasses = 'table';
      tableClasses += this.props.component.striped ? ' table-striped' : '';
      tableClasses += this.props.component.bordered ? ' table-bordered' : '';
      tableClasses += this.props.component.hover ? ' table-hover' : '';
      tableClasses += this.props.component.condensed ? ' table-condensed' : '';
      tableClasses += this.props.component.customClass ? ' ' + this.props.component.customClass : '';
      return _react2.default.createElement(
        'div',
        { className: 'table-responsive' },
        title,
        _react2.default.createElement(
          'table',
          { className: tableClasses },
          _react2.default.createElement(
            'thead',
            null,
            this.props.component.header.map(function (header, index) {
              return _react2.default.createElement(
                'th',
                { key: index },
                header
              );
            }.bind(this))
          ),
          _react2.default.createElement(
            'tbody',
            null,
            this.props.component.rows.map(function (row, index) {
              return _react2.default.createElement(
                'tr',
                { key: index },
                row.map(function (column, index) {
                  return _react2.default.createElement(
                    'td',
                    { key: index },
                    _react2.default.createElement(_components.FormioComponentsList, _extends({}, this.props, {
                      components: column.components
                    }))
                  );
                }.bind(this))
              );
            }.bind(this))
          )
        )
      );
    }
  }]);

  return _class;
}(_react2.default.Component), _class.displayName = 'Panel', _temp);