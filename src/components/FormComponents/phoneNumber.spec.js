import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import PhoneNumber from './phoneNumber.jsx';
import sinon from 'sinon';
import form from '../../../test/forms/empty.json';

describe('phoneNumber', function () {
  describe('Single phoneNumber', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "phoneNumber",
      "validate": {
        "required": false
      },
      "defaultValue": "",
      "persistent": true,
      "unique": false,
      "protected": false,
      "multiple": false,
      "suffix": "",
      "prefix": "",
      "placeholder": "",
      "key": "phoneNumber",
      "label": "Phone Number",
      "inputMask": "(999) 999-9999",
      "tableView": true,
      "input": true
    };

    var attachToForm = sinon.spy();
    it('Renders a basic phoneNumber', function (done) {
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-phoneNumber form-group-phoneNumber')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-phoneNumber');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single label').length).to.equal(1);
      expect(element.find('.formio-component-single label').html()).to.equal('Phone Number');
      expect(element.find('.formio-component-single label').attr('for')).to.equal('phoneNumber');
      expect(element.find('.formio-component-single .input-group').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').attr('class')).to.equal('form-control');
      expect(element.find('.formio-component-single .input-group input').attr('id')).to.equal('phoneNumber');
      expect(element.find('.formio-component-single .input-group input').attr('data-index')).to.equal('0');
      expect(element.find('.formio-component-single .input-group input').attr('value')).to.equal('');
      expect(element.find('.formio-component-single .input-group input').attr('placeholder')).to.equal('');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'Test Placeholder';
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('input#phoneNumber');
      expect(element.attr('placeholder')).to.equal('Test Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      component.prefix = '';
      done();
    });

    it('Renders with a suffix', function(done) {
      component.suffix = 'Pounds';
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      component.suffix = '';
      done();
    });

    it('Renders with prefix and suffix', function(done) {
      component.prefix = 'Prefix';
      component.suffix = 'Suffix';
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.input-group');
      expect(element.children().length).to.equal(3);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('Prefix');
      expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(2).html()).to.equal('Suffix');
      component.prefix = '';
      component.suffix = '';
      done();
    });

    it('Sets a default value', function(done) {
      const element = render(
        <PhoneNumber
      component={component}
      value='(919) 999-9999'
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('input');
      expect(element.attr('value')).to.equal('(919) 999-9999');
      done();
    });

    //it('Sets a invalid input for single phoneNumber', function(done) {
    //  const element = mount(
    //    <PhoneNumber
    //  component={component}
    //  attachToForm={attachToForm}
    //    ></PhoneNumber>
    //  );
    //  element.find('input').simulate('change', {target: {value: '999a'}});
    //  expect(element.find('input').get(0).value).to.equal('(999) ___-____');
    //  done();
    //});

    it('Check single phoneNumber with required', function(done) {
      component.validate.required = true;
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check single phoneNumber without required', function(done) {
      component.validate.required = false;
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label');
      done();
    });

    it('Check single phoneNumber without label', function(done) {
      component.label = '';
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      );
      expect(element.find('.formio-component-single label').length).to.equal(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <PhoneNumber
          component={component}
          attachToForm={attachToForm}
        ></PhoneNumber>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  });

  describe('Multiple phoneNumber', function() {
    var component = {
      "input": true,
      "tableView": true,
      "inputMask": "(999) 999-9999",
      "label": "Phone Number",
      "key": "phoneNumber",
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "multiple": true,
      "protected": false,
      "unique": false,
      "persistent": true,
      "defaultValue": "",
      "validate": {
        "required": false
      },
      "type": "phoneNumber",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();
    it('Renders a multi-value phoneNumber', function(done) {
      const element = render(
        <PhoneNumber
      name="phoneNumber"
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.form-field-type-phoneNumber');
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-phoneNumber form-group-phoneNumber')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-phoneNumber');
      expect(element.children().eq(0).hasClass('formio-component-multiple')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).attr('for')).to.equal('phoneNumber');
      expect(element.children().eq(0).children().eq(0).hasClass('control-label')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).text()).to.equal('Phone Number');
      const table = element.children().eq(0).children().eq(1);
      expect(table.hasClass('table table-bordered')).to.equal(true);
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr td div.input-group').length).to.equal(1);
      expect(table.find('tr td div.input-group input').attr('placeholder')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('value')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('id')).to.equal('phoneNumber');
      expect(table.find('tr td div.input-group input').attr('name')).to.equal('phoneNumber');
      expect(table.find('tr td div.input-group input').attr('class')).to.equal('form-control');
      expect(table.find('tr td div.input-group input').attr('data-index')).to.equal('0');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <PhoneNumber
      name="phoneNumber"
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('input#phoneNumber');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <PhoneNumber
      name="phoneNumber"
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      component.prefix = '';
      done();
    });

    it('Renders with a suffix', function(done) {
      component.suffix = 'Pounds';
      const element = render(
        <PhoneNumber
      name="phoneNumber"
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      component.suffix = '';
      done();
    });

    it('Renders with prefix and suffix', function(done) {
      component.prefix = 'Prefix';
      component.suffix = 'Suffix';
      const element = render(
        <PhoneNumber
      name="phoneNumber"
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.input-group');
      expect(element.children().length).to.equal(3);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('Prefix');
      expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(2).html()).to.equal('Suffix');
      component.prefix = '';
      component.suffix = '';
      done();
    });

    it('Sets a default value', function(done) {
      const element = render(
        <PhoneNumber
      name="phoneNumber"
      value="(919) 999-9999"
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('input');
      expect(element.attr('value')).to.equal('(919) 999-9999');
      done();
    });

    //it('Sets a invalid input for multiple phoneNumber', function(done) {
    //  const element = render(
    //    <PhoneNumber
    //  component={component}
    //  value='999a'
    //  attachToForm={attachToForm}
    //    ></PhoneNumber>
    //  ).find('input');
    //  expect(element.attr('value')).to.equal('(999) ___-____');
    //  done();
    //});

    it('Adds and removes rows', function(done) {
      component.defaultValue = '(919) 999-9999';
      const element = mount(
        <PhoneNumber
      name="phoneNumber"
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      ).find('.form-field-type-phoneNumber');
      const table = element.find('table');
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(3);
      expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(4);
      expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('input').prop('data-index')).to.equal(2);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(5);
      expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('input').prop('data-index')).to.equal(2);
      expect(table.find('tr').at(3).find('input').prop('data-index')).to.equal(3);
      table.find('a.btn.remove-row-3').simulate('click');
      expect(table.find('tr').length).to.equal(4);
      expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('input').prop('data-index')).to.equal(2);
      table.find('a.btn.remove-row-1').simulate('click');
      expect(table.find('tr').length).to.equal(3);
      expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
      table.find('a.btn.remove-row-1').simulate('click');
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
      table.find('a.btn.remove-row-0').simulate('click');
      expect(table.find('tr').length).to.equal(1);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
      done();
    })

    it('Check multiple phoneNumber with required', function(done) {
      component.validate.required = true;
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check multiple phoneNumber without required', function(done) {
      component.validate.required = false;
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label');
      component.validate.required = true;
      done();
    });

    it('Check multiple phoneNumber without label', function(done) {
      component.label = '';
      const element = render(
        <PhoneNumber
      component={component}
      attachToForm={attachToForm}
        ></PhoneNumber>
      );
      expect(element.find('.formio-component-multiple label').length).to.equal(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <PhoneNumber
          component={component}
          attachToForm={attachToForm}
        ></PhoneNumber>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  });

});
