

import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Currency from '../src/components/currency.jsx';
import sinon from 'sinon';
import form from './forms/empty.json';

describe('Currency', function () {
  describe('Single Currency', function () {
    var component= {
      "input": true,
      "tableView": true,
      "inputType": "text",
      "inputMask": "",
      "label": "Currency Lable",
      "key": "currency",
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "defaultValue": "",
      "protected": false,
      "persistent": true,
      "validate": {
        "required": false,
        "multiple": "",
        "custom": ""
      },
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      },
      "type": "currency"
    };
    var attachToForm = sinon.spy();

    it('Renders a basic currency', function (done) {
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-currency form-group-currency')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-currency');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single label').length).to.equal(1);
      expect(element.find('.formio-component-single label').html()).to.equal('Currency Lable');
      expect(element.find('.formio-component-single label').attr('for')).to.equal('currency');
      expect(element.find('.formio-component-single .input-group').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').attr('class')).to.equal('form-control');
      expect(element.find('.formio-component-single .input-group input').attr('id')).to.equal('currency');
      expect(element.find('.formio-component-single .input-group input').attr('data-index')).to.equal('0');
      expect(element.find('.formio-component-single .input-group input').attr('value')).to.equal('');
      expect(element.find('.formio-component-single .input-group input').attr('placeholder')).to.equal('');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'Test Placeholder';
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      ).find('input');
      expect(element.attr('placeholder')).to.equal('Test Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
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
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
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
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
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

    it('Check single currency with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check single currency without required', function(done) {
      component.validate.required = false;
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label');
      done();
    });

    it('Check single currency with label', function(done) {
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-single label').length).to.equal(1);
      done();
    });

    it('Check single currency without label', function(done) {
      component.label = '';
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-single label').length).to.equal(0);
      done();
    });

  });

  describe('Multiple currency', function() {
    var component = {
      "multiple": true,
      "type": "currency",
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "validate": {
        "custom": "",
        "multiple": "",
        "required": false
      },
      "persistent": true,
      "protected": false,
      "defaultValue": "",
      "suffix": "",
      "prefix": "",
      "placeholder": "",
      "key": "currency",
      "label": "Currency Lable",
      "inputMask": "",
      "inputType": "text",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Renders a multi-value currency', function(done) {
      const element = render(
        <Currency
      name="currency"
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      ).find('.form-field-type-currency');
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-currency form-group-currency')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-currency');
      expect(element.children().eq(0).hasClass('formio-component-multiple')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).attr('for')).to.equal('currency');
      expect(element.children().eq(0).children().eq(0).hasClass('control-label')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).text()).to.equal('Currency Lable');
      const table = element.children().eq(0).children().eq(1);
      expect(table.hasClass('table table-bordered')).to.equal(true);
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr td div.input-group').length).to.equal(1);
      expect(table.find('tr td div.input-group input').attr('placeholder')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('value')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('id')).to.equal('currency');
      expect(table.find('tr td div.input-group input').attr('name')).to.equal('currency');
      expect(table.find('tr td div.input-group input').attr('class')).to.equal('form-control');
      expect(table.find('tr td div.input-group input').attr('data-index')).to.equal('0');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <Currency
      name="Currency"
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      ).find('input');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Currency
      name="Currency"
      component={component}
      attachToForm={attachToForm}
        ></Currency>
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
        <Currency
      name="currency"
      component={component}
      attachToForm={attachToForm}
        ></Currency>
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
        <Currency
      name="currency"
      component={component}
      attachToForm={attachToForm}
        ></Currency>
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

    it('Adds and removes rows', function(done) {
      const element = mount(
        <Currency
      name="currency"
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      ).find('.form-field-type-currency');
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

    it('Check multiple currency with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check multiple currency without required', function(done) {
      component.validate.required = false;
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label');
      component.validate.required = true;
      done();
    });

    it('Check multiple currency with label', function(done) {
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-multiple label').length).to.equal(1);
      done();
    });

    it('Check multiple currency without label', function(done) {
      component.label = '';
      const element = render(
        <Currency
      component={component}
      attachToForm={attachToForm}
        ></Currency>
      );
      expect(element.find('.formio-component-multiple label').length).to.equal(0);
      done();
    });

  });

});
