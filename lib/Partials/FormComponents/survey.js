'use strict';

var React = require('react');
var valueMixin = require('./mixins/valueMixin');

module.exports = React.createClass({
  displayName: 'Survey',
  mixins: [valueMixin],
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
        return React.createElement(
          'td',
          { className: ' formio-content-centered' },
          answersData.label
        );
      } else {
        return React.createElement(
          'td',
          { key: index, className: ' formio-content-centered' },
          React.createElement('input', {
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
    return React.createElement(
      'div',
      { className: 'table-responsive', key: key },
      header,
      React.createElement(
        'table',
        { className: tableClasses },
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            { key: firstRowKey },
            React.createElement('td', { key: 'blankCell' }),
            this.generateAnswerCell(null, 'label')
          ),
          this.props.component.questions.map(function (questionsData, index) {
            return React.createElement(
              'tr',
              { key: index },
              React.createElement(
                'td',
                { key: index },
                React.createElement(
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