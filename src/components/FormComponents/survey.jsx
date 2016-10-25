import React from 'react';
import valueMixin from './mixins/valueMixin';

module.exports = React.createClass({
  displayName: 'Survey',
  mixins: [valueMixin],
  getInitialValue: function() {
    return {};
  },
  onUpdateAnswer: function(answersData, questionsData) {
    var value = this.state.value;
    value[questionsData] = answersData;
    this.setValue(value);
  },
  generateAnswerCell: function(questionsData, inputType) {
    var cellData = [];
    cellData.push(
      this.props.component.values.map(function(answersData, index) {
        if (inputType === 'label') {
          return (
            <td className=" formio-content-centered">
              {answersData.label}
            </td>
          );
        }
        else {
          return (
            <td key={index} className=" formio-content-centered">
              <input
                type="radio"
                disabled={this.props.readOnly}
                checked={this.state.value[questionsData.value] === answersData.value ? true : false}
                onChange={this.onUpdateAnswer.bind(null, answersData.value, questionsData.value)}
              >
              </input>
            </td>
          );
        }
      }.bind(this))
    );
    return cellData;
  },
  getElements: function() {
    var header = this.props.component.label ? this.props.component.label : '';
    var tableClasses = 'table';
    tableClasses += ' table-striped';
    tableClasses += ' table-bordered';

    var required = (this.props.component.validate.required ? 'field-required' : '');
    var key = (this.props.component.key) ? this.props.component.key : this.props.component.type ;
    var firstRowKey = key + 'firstRow';
    return (
      <div className="table-responsive" key={key}>
        {header}
        <table className={tableClasses}>
          <tbody>
          <tr key={firstRowKey}>
            <td key="blankCell"></td>
            {this.generateAnswerCell(null, 'label')}
          </tr>
          {this.props.component.questions.map(function(questionsData, index) {
            return (
              <tr key={index}>
                <td key={index}>
                  <label className={required}>
                    {questionsData.label}
                  </label>
                </td>
                {this.generateAnswerCell(questionsData, 'radio')}
              </tr>
            );
          }.bind(this))}
          </tbody>
        </table>
      </div>
    );
  },
  getValueDisplay: function(component, data) {
    let values = component.values.reduce((values, item) => {
      values[item.value] = item.label;
      return values;
    }, {});
    return (
      <table className="table table-striped table-bordered">
        <thead>
        {
          component.questions.map((question, index) => {
            return (
              <tr key={index}>
                <th>
                  {question.label}
                </th>
                <td>
                  {values[data[question.value]]}
                </td>
              </tr>
            );
          })
        }
        </thead>
      </table>
    );
  }
});
