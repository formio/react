import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Checkbox from '../src/components/checkbox.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Checkbox', function () {
  describe('Checkbox field', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "checkbox",
      "validate": {
        "required": false
      },
      "persistent": true,
      "protected": false,
      "defaultValue": false,
      "key": "checkbox",
      "label": "Checkbox",
      "hideLabel": true,
      "tableView": true,
      "inputType": "checkbox",
      "input": true
    };
    var attachToForm = sinon.spy();
    it('Renders a checkbox field', function (done) {
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-checkbox form-group-checkbox')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-checkbox');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group .checkbox label').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group .checkbox label').html()).to.equal('<input type="checkbox" id="checkbox" data-index="0">Checkbox');
      expect(element.find('.formio-component-single .input-group .checkbox input').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group .checkbox').attr('class')).to.equal('checkbox');
      expect(element.find('.formio-component-single .input-group .checkbox input').attr('type')).to.equal('checkbox');
      expect(element.find('.formio-component-single .input-group .checkbox input').attr('id')).to.equal('checkbox');
      expect(element.find('.formio-component-single .input-group .checkbox input').attr('data-index')).to.equal('0');
      done();
    });

    it('Sets a default value as a ture', function(done) {
      component.defaultValue = true;
      const element = render(
        <Checkbox
      component={component}
      value={component.defaultValue}
      attachToForm={attachToForm}
        ></Checkbox>
      ).find('#checkbox');
      expect(element.attr('checked')).to.equal('checked');
      component.defaultValue = false;
      done();
    });

    it('Check the validations', function(done) {
      component.validate.required = true;
      const element = render(
        <Checkbox
      component={component}
      attachToForm={attachToForm}
        ></Checkbox>
      );
      expect(element.find('.formio-component-single .input-group .checkbox label').attr('class')).to.equal('control-label field-required not-checked');
      done();
    });

    it('Sets the checked class when selected', function(done) {
      const element = mount(
        <Checkbox
          component={component}
          attachToForm={attachToForm}
        ></Checkbox>
      );
      expect(element.find('label').hasClass('not-checked')).to.equal(true);
      element.find('input').simulate('change', {"target": {"checked": true}});
      expect(element.find('label').hasClass('checked')).to.equal(true);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Checkbox
          component={component}
          attachToForm={attachToForm}
        ></Checkbox>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });
  });

});
