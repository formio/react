import React from 'react';
import valueMixin from './mixins/valueMixin';
import multiMixin from './mixins/multiMixin';

module.exports = React.createClass({
  displayName: 'Textfield',
  mixins: [valueMixin, multiMixin],
  onChangeCustom: function() {
    const padLeft = function padLeft(nr, n, str) {
      return Array(n - String(nr.toString()).length + 1).join(str || '0') + nr.toString();
    };
    const { date } = this.state;

    this.setValue(padLeft(date.day, 2) + '/' + padLeft(date.month, 2) + '/' + padLeft(date.year, 4));
  },
  customState: function(state) {
    state.date = {
      day: '',
      month: '',
      year: ''
    };
    if (state.value) {
      var parts = state.value.split('/');
      state.date.day = parts[(this.props.component.dayFirst ? 0 : 1)];
      state.date.month = parseInt(parts[(this.props.component.dayFirst ? 1 : 0)]).toString();
      state.date.year = parts[2];
    }
    return state;
  },
  willReceiveProps: function(nextProps) {
    if (this.state.value !== nextProps.value) {
      if (!nextProps.value) {
        return;
      }
      var parts = nextProps.value.split('/');
      this.setState({
        date: {
          day: parts[(this.props.component.dayFirst ? 0 : 1)],
          month: parseInt(parts[(this.props.component.dayFirst ? 1 : 0)]).toString(),
          year: parts[2]
        }
      })
    }
  },
  getDatePart: function(config) {
    const classes = (config.required ? 'field-required' : '');

    const constrainValue = (event) => {
      let { value } = event.target;
      if (value.length > config.characters) {
        value = value.substring(0, config.characters);
      }
      if (isNaN(value)) {
        value = value.replace(/\D/g,'');
      }
      if (
        parseInt(value) < parseInt(config.min) ||
        parseInt(value) > parseInt(config.max)
      ) {
        value = value.substring(0, config.characters - 1)
      }

      this.setState(state => {
        state.date[config.key] = value;
        return state;
      }, this.onChangeCustom);
    }

    return (
      <div className={'form-group col-xs-' + config.columns}>
        <label htmlFor={config.componentId} className={classes}>{config.title}</label>
        <input
          className='form-control'
          type='text'
          id={config.componentId}
          style={{paddingRight: '10px'}}
          placeholder={config.placeholder}
          value={this.state.date[config.key]}
          onChange={constrainValue}
          disabled={this.props.readOnly}
        />
      </div>
    )
  },
  getDay: function(componentId, field) {
    return this.getDatePart({
      key: 'day',
      componentId: componentId + '-day',
      title: 'Day',
      placeholder: field.placeholder,
      required: field.required,
      columns: 3,
      min: 0,
      max: 31,
      characters: 2
    });
  },
  getMonth: function(componentId, field) {
    const classes = (field.required ? 'field-required' : '');
    const options = [field.placeholder, 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const onChangeMonth = (event) => {
      let { value } = event.target;
      this.setState(state => {
        state.date['month'] = value;
        return state;
      }, this.onChangeCustom);
    }
    return (
      <div className='form-group col-xs-4'>
        <label htmlFor={componentId + '-month'} className={classes}>Month</label>
        <select className='form-control'
          type='text'
          id={componentId + '-month'}
          disabled={this.props.readOnly}
          value={this.state.date.month}
          onChange={onChangeMonth}
        >
          {options.map((month, index) => {
            return (
              <option value={index} key={index}>{month}</option>
            );
          })}
        </select>
      </div>
    );
  },
  getYear: function(componentId, field) {
    return this.getDatePart({
      key: 'year',
      componentId: componentId + '-year',
      title: 'Year',
      placeholder: field.placeholder,
      required: field.required,
      columns: 5,
      min: 0,
      max: 2100,
      characters: 4
    });
  },
  getSingleElement: function(value, index) {
    let { component } = this.props;
    return (
      <div className='day-input'>
        <div className='daySelect form row'>
          {(component.dayFirst ? this.getDay(component.key, component.fields.day) : this.getMonth(component.key, component.fields.month))}
          {(component.dayFirst ? this.getMonth(component.key, component.fields.month) : this.getDay(component.key, component.fields.day))}
          {this.getYear(component.key, component.fields.year)}
        </div>
      </div>
    );
  }
});
