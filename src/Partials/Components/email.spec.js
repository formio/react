import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Email from './email.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Email @email', function () {
  describe('Single email', function () {
    var component= {
      "validate": {
        "required": false
      },
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "email",
      "persistent": true,
      "unique": true,
      "protected": false,
      "defaultValue": "",
      "suffix": "",
      "prefix": "",
      "placeholder": "",
      "key": "email",
      "label": "my email",
      "inputType": "email",
      "tableView": true,
      "input": true
    };

    var attachToForm = sinon.spy();
    it('Renders a basic email', function (done) {
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-email form-group-email')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-email');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single label').length).to.equal(1);
      expect(element.find('.formio-component-single label').html()).to.equal('my email');
      expect(element.find('.formio-component-single label').attr('for')).to.equal('email');
      expect(element.find('.formio-component-single .input-group').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').attr('class')).to.equal('form-control');
      expect(element.find('.formio-component-single .input-group input').attr('id')).to.equal('email');
      expect(element.find('.formio-component-single .input-group input').attr('data-index')).to.equal('0');
      expect(element.find('.formio-component-single .input-group input').attr('value')).to.equal('');
      expect(element.find('.formio-component-single .input-group input').attr('placeholder')).to.equal('');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'Test Placeholder';
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      ).find('input#email');
      expect(element.attr('placeholder')).to.equal('Test Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
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
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
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
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
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
        <Email
      component={component}
      value='testEmail@test.com'
      attachToForm={attachToForm}
        ></Email>
      ).find('input');
      expect(element.attr('value')).to.equal('testEmail@test.com');
      done();
    });

    it('Check single email with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check single email without required', function(done) {
      component.validate.required = false;
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label');
      done();
    });

    it('Check single email without label', function(done) {
      component.label = '';
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      );
      expect(element.find('.formio-component-single label').length).to.equal(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Email
          component={component}
          attachToForm={attachToForm}
        ></Email>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

    it('validates emails', function(done) {
      const element = mount(
        <Email
          component={component}
          attachToForm={attachToForm}
        ></Email>
      );
      expect(element.state('isPristine')).to.be.true;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('email must be a valid email.');
      element.find('input').simulate('change', {target: {value: 'bademail'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('email must be a valid email.');
      expect(element.state('value')).to.equal('bademail');
      element.find('input').simulate('change', {target: {value: 'email@example'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      expect(element.state('value')).to.equal('email@example');
      element.find('input').simulate('change', {target: {value: 'email@example.com'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      expect(element.state('value')).to.equal('email@example.com');
      element.find('input').simulate('change', {target: {value: ''}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('email must be a valid email.');
      expect(element.state('value')).to.equal('');
      done();
    });

  });

  describe('Multiple email', function() {
    var component = {
      "multiple": true,
      "validate": {
        "required": true
      },
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "email",
      "persistent": true,
      "unique": true,
      "protected": false,
      "defaultValue": "",
      "suffix": "",
      "prefix": "",
      "placeholder": "",
      "key": "email",
      "label": "my email",
      "inputType": "email",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();
    it('Renders a multi-value email', function(done) {
      const element = render(
        <Email
      name="email"
      component={component}
      attachToForm={attachToForm}
        ></Email>
      ).find('.form-field-type-email');
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-email form-group-email')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-email');
      expect(element.children().eq(0).hasClass('formio-component-multiple')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).attr('for')).to.equal('email');
      expect(element.children().eq(0).children().eq(0).hasClass('control-label')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).text()).to.equal('my email');
      const table = element.children().eq(0).children().eq(1);
      expect(table.hasClass('table table-bordered')).to.equal(true);
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr td div.input-group').length).to.equal(1);
      expect(table.find('tr td div.input-group input').attr('placeholder')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('value')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('id')).to.equal('email');
      expect(table.find('tr td div.input-group input').attr('name')).to.equal('email');
      expect(table.find('tr td div.input-group input').attr('class')).to.equal('form-control');
      expect(table.find('tr td div.input-group input').attr('data-index')).to.equal('0');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <Email
      name="email"
      component={component}
      attachToForm={attachToForm}
        ></Email>
      ).find('input#email');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Email
      name="email"
      component={component}
      attachToForm={attachToForm}
        ></Email>
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
        <Email
      name="email"
      component={component}
      attachToForm={attachToForm}
        ></Email>
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
        <Email
      name="email"
      component={component}
      attachToForm={attachToForm}
        ></Email>
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
        <Email
      name="email"
      component={component}
      attachToForm={attachToForm}
        ></Email>
      ).find('.form-field-type-email');
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

    it('Check multiple email with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check multiple email without required', function(done) {
      component.validate.required = false;
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label');
      component.validate.required = true;
      done();
    });

    it('Check multiple email without label', function(done) {
      component.label = '';
      const element = render(
        <Email
      component={component}
      attachToForm={attachToForm}
        ></Email>
      );
      expect(element.find('.formio-component-multiple label').length).to.equal(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Email
          component={component}
          attachToForm={attachToForm}
        ></Email>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });
  });

});
