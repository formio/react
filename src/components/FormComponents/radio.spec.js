import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Radio from './radio.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Radio', function () {
  describe('Radio field', function () {
    var component= {
      "input": true,
      "tableView": true,
      "inputType": "radio",
      "label": "",
      "key": "radio",
      "values": [
        {
          "value": "test",
          "label": "test"
        },
        {
          "value": "test1",
          "label": "test1"
        }
      ],
      "defaultValue": "",
      "protected": false,
      "persistent": true,
      "validate": {
        "required": false,
        "custom": "",
        "customPrivate": false
      },
      "type": "radio",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      },
      "inline": false
    };
    var attachToForm = sinon.spy();

    it('Renders a radio field', function (done) {
      const element = render(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-radio form-group-radio')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-radio');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group .radio-wrapper ').length).to.equal(1);
      done();
    });

    it('Check the label value for each radio component', function(done) {
      const element = render(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('.radio-wrapper');
      expect(element.length).to.equal(1);

      //To test the label of each select boxes
      for (var i= 0; i<component.values.length; i++) {
        expect(element.find('.radio label input')[i].next.data).to.equal(component.values[i].label);
      }

      done();
    });

    it('Check radio component with label', function(done) {
      component.label = 'test Label';
      const element = render(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('label').eq(0);
      expect(element.attr('class')).to.equal('control-label');
      expect(element.length).to.equal(1);
      done();
    });

    it('Check the validations with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('.formio-component-single');
      expect(element.find('.formio-component-single label').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check the validations without required', function(done) {
      component.validate.required = false;
      const element = render(
        <Radio
      component={component}
      attachToForm={attachToForm}
        ></Radio>
      ).find('.formio-component-single');
      expect(element.find('.formio-component-single label').attr('class')).to.equal('control-label');
      done();
    });

    it('Sets the checked class when selected', function(done) {
      const element = mount(
        <Radio
          component={component}
          attachToForm={attachToForm}
        ></Radio>
      );
      // There is a label in the header so indexes are off by 1.
      expect(element.find('label').at(1).hasClass('not-checked')).to.equal(true);
      element.find('input').at(0).simulate('change', {"target": {"id": element.find('input').at(0).prop('id')}});
      expect(element.find('label').at(1).hasClass('checked')).to.equal(true);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Radio
          component={component}
          attachToForm={attachToForm}
        ></Radio>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

    //To Do :- Write a test case to validate the inline layout support.

  });

});
