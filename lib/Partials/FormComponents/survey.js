'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _valueMixin = require('./mixins/valueMixin');

var _valueMixin2 = _interopRequireDefault(_valueMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _react2.default.createClass({
  displayName: 'Survey',
  mixins: [_valueMixin2.default],
  getInitialValue: function getInitialValue() {
    return {};
  },
  onUpdateAnswer: function onUpdateAnswer(answersData, questionsData) {
    var value = this.state.value;
    value[questionsData] = answersData;
    this.setValue(value);
  },
  generateAnswerCell: function generateAnswerCell(questionsData, inputType) {
    var cellData = [];
    cellData.push(this.props.component.values.map(function (answersData, index) {
      if (inputType === 'label') {
        return _react2.default.createElement(
          'td',
          { className: ' formio-content-centered' },
          answersData.label
        );
      } else {
        return _react2.default.createElement(
          'td',
          { key: index, className: ' formio-content-centered' },
          _react2.default.createElement('input', {
            type: 'radio',
            checked: this.state.value[questionsData.value] === answersData.value ? true : false,
            onChange: this.onUpdateAnswer.bind(null, answersData.value, questionsData.value)
          })
        );
      }
    }.bind(this)));
    return cellData;
  },
  getElements: function getElements() {
    var header = this.props.component.label ? this.props.component.label : '';
    var tableClasses = 'table';
    tableClasses += ' table-striped';
    tableClasses += ' table-bordered';

    var required = this.props.component.validate.required ? 'field-required' : '';
    var key = this.props.component.key ? this.props.component.key : this.props.component.type;
    var firstRowKey = key + 'firstRow';
    return _react2.default.createElement(
      'div',
      { className: 'table-responsive', key: key },
      header,
      _react2.default.createElement(
        'table',
        { className: tableClasses },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            { key: firstRowKey },
            _react2.default.createElement('td', { key: 'blankCell' }),
            this.generateAnswerCell(null, 'label')
          ),
          this.props.component.questions.map(function (questionsData, index) {
            return _react2.default.createElement(
              'tr',
              { key: index },
              _react2.default.createElement(
                'td',
                { key: index },
                _react2.default.createElement(
                  'label',
                  { className: required },
                  questionsData.label
                )
              ),
              this.generateAnswerCell(questionsData, 'radio')
            );
          }.bind(this))
        )
      )
    );
  }
});