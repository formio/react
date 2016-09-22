'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormioComponents = require('../FormioComponents');

var _FormioComponents2 = _interopRequireDefault(_FormioComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Panel',
  render: function render() {
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
                  _react2.default.createElement(_FormioComponents2.default, _extends({}, this.props, {
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
});