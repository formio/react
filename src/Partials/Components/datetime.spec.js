import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import DateTimePicker from './datetime.jsx';
import { date as DateLocalizer } from 'react-widgets/lib/util/localizers';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Datetime', function () {
  describe('datetime field', function () {
    var component= {
      "input": true,
      "tableView": true,
      "label": "TestDate",
      "key": "testDate",
      "placeholder": "",
      "format": "yyyy-MM-dd HH:mm",
      "enableDate": true,
      "enableTime": true,
      "defaultDate": new Date(),
      "datepickerMode": "day",
      "datePicker": {
        "showWeeks": true,
        "startingDay": 0,
        "initDate": "",
        "minMode": "day",
        "maxMode": "year",
        "yearRange": "20",
        "datepickerMode": "day"
      },
      "timePicker": {
        "hourStep": 1,
        "minuteStep": 1,
        "showMeridian": true,
        "readonlyInput": false,
        "mousewheel": true,
        "arrowkeys": true
      },
      "protected": false,
      "persistent": true,
      "validate": {
        "required": false,
        "custom": ""
      },
      "type": "datetime",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }

    };
    var attachToForm = sinon.spy();

    it('Renders a basic datetime field', function (done) {
      const element = render(
        <DateTimePicker
          component={component}
          attachToForm={attachToForm}
        ></DateTimePicker>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-datetime form-group-testDate')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-testDate');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group .rw-datetimepicker input').attr('type')).to.equal('text');
      expect(element.find('.formio-component-single .input-group .rw-datetimepicker input').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group .rw-datetimepicker input').attr('class')).to.equal('rw-input');
      expect(element.find('.formio-component-single .input-group .rw-datetimepicker input').attr('id')).to.equal('testDate_input');
      done();
    });

    it('Renders with the default date value', function (done) {
      const format = DateLocalizer.getFormat('default');
      const element = render(
        <DateTimePicker
          component={component}
          attachToForm={attachToForm}
        ></DateTimePicker>
      ).find('.formio-component-single .input-group .rw-datetimepicker input');
      expect(element.val()).to.equal(DateLocalizer.format(component.defaultDate, format));
      done();
    });

    it('Check with the label of DatetimePicker', function (done) {
      component.label = 'Test DatetimePicker'
      const element = render(
        <DateTimePicker
          component={component}
          attachToForm={attachToForm}
        ></DateTimePicker>
      ).find('.control-label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(1);
      done();
    });

    it('Check without label of DatetimePicker', function (done) {
      component.label = null;
      const element = render(
        <DateTimePicker
          component={component}
          attachToForm={attachToForm}
        ></DateTimePicker>
      ).find('.control-label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(0);
      done();
    });

    it('Check calendar popup window of date and time component', function(done) {
      const element = mount(
        <DateTimePicker
          component={component}
          attachToForm={attachToForm}
        ></DateTimePicker>
      );
      element.find('.rw-btn-calendar').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-calendar-popup')).to.have.length(1);
      element.find('.rw-btn-calendar').simulate('click');
      expect(element.find('.rw-open')).to.have.length(0);
      expect(element.find('.rw-list')).to.have.length(0);
      done();
    });

      it('Check time popup window of date and time component', function(done) {
      const element = mount(
        <DateTimePicker
          component={component}
          attachToForm={attachToForm}
        ></DateTimePicker>
      );
      element.find('.rw-btn-time').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-list')).to.have.length(1);
      element.find('.rw-btn-time').simulate('click');
      expect(element.find('.rw-open')).to.have.length(0);
      expect(element.find('.rw-list')).to.have.length(0);
      done();
    });

  });

});
