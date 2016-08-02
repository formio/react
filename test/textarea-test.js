import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Textarea from '../src/components/textarea.jsx';
import sinon from 'sinon';
import form from './forms/empty.json';

describe('Textarea', function () {
  describe('Single Textarea', function () {
    var component= {
      "input": true,
      "tableView": true,
      "label": "textarea",
      "key": "textarea",
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "rows": 3,
      "multiple": false,
      "defaultValue": "",
      "protected": false,
      "persistent": true,
      "wysiwyg": false,
      "validate": {
        "required": false,
        "minLength": "",
        "maxLength": "",
        "pattern": "",
        "custom": ""
      },
      "type": "textarea",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();

    it('Renders a basic textarea', function (done) {
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-textarea form-group-textarea')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-textarea');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single label').length).to.equal(1);
      expect(element.find('.formio-component-single label').html()).to.equal('textarea');
      expect(element.find('.formio-component-single label').attr('for')).to.equal('textarea');
      expect(element.find('.formio-component-single .input-group').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group textarea').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group textarea').attr('class')).to.equal('form-control');
      expect(element.find('.formio-component-single .input-group textarea').attr('id')).to.equal('textarea');
      expect(element.find('.formio-component-single .input-group textarea').attr('data-index')).to.equal('0');
      expect(element.find('.formio-component-single .input-group textarea').attr('placeholder')).to.equal('');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      ).find('textarea');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
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
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
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
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
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

    it('Check single textarea with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check single textarea without required', function(done) {
      component.validate.required = false;
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      );
      expect(element.find('.formio-component-single label ').attr('class')).to.equal('control-label');
      done();
    });

    it('Check single textarea without label', function(done) {
      component.label = '';
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      );
      expect(element.find('.formio-component-single label').length).to.equal(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Textarea
          component={component}
          attachToForm={attachToForm}
        ></Textarea>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  });

  describe('Multiple Textarea', function() {
    var component = {
      "input": true,
      "tableView": true,
      "label": "textarea",
      "key": "textarea",
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "rows": 3,
      "multiple": true,
      "defaultValue": "",
      "protected": false,
      "persistent": true,
      "wysiwyg": false,
      "validate": {
        "required": false,
        "minLength": "",
        "maxLength": "",
        "pattern": "",
        "custom": ""
      },
      "type": "textarea",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();

    it('Renders a multi-value textarea', function(done) {
      const element = render(
        <Textarea
      name="textarea"
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      ).find('.form-field-type-textarea');
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-textarea form-group-textarea')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-textarea');
      expect(element.children().eq(0).hasClass('formio-component-multiple')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).attr('for')).to.equal('textarea');
      expect(element.children().eq(0).children().eq(0).hasClass('control-label')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).text()).to.equal('textarea');
      const table = element.children().eq(0).children().eq(1);
      expect(table.hasClass('table table-bordered')).to.equal(true);
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr td div.input-group').length).to.equal(1);
      expect(table.find('tr td div.input-group textarea').attr('placeholder')).to.equal('');
      //expect(table.find('tr td div.input-group textarea').attr('value')).to.equal('');
      expect(table.find('tr td div.input-group textarea').attr('id')).to.equal('textarea');
      expect(table.find('tr td div.input-group textarea').attr('name')).to.equal('textarea');
      expect(table.find('tr td div.input-group textarea').attr('class')).to.equal('form-control');
      expect(table.find('tr td div.input-group textarea').attr('data-index')).to.equal('0');
      done();
    });

    it('Fills in the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <Textarea
      name="textarea"
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      ).find('textarea#textarea');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });

    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Textarea
      name="textarea"
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
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
        <Textarea
      name="textarea"
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
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
        <Textarea
      name="textarea"
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
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
      component.defaultValue = 'My Value';
      const element = mount(
        <Textarea
      name="textarea"
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      ).find('.form-field-type-textarea');
      const table = element.find('table');
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(3);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(4);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('textarea').prop('data-index')).to.equal(2);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(5);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('textarea').prop('data-index')).to.equal(2);
      expect(table.find('tr').at(3).find('textarea').prop('data-index')).to.equal(3);
      table.find('a.btn.remove-row-3').simulate('click');
      expect(table.find('tr').length).to.equal(4);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      expect(table.find('tr').at(2).find('textarea').prop('data-index')).to.equal(2);
      table.find('a.btn.remove-row-1').simulate('click');
      expect(table.find('tr').length).to.equal(3);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      expect(table.find('tr').at(1).find('textarea').prop('data-index')).to.equal(1);
      table.find('a.btn.remove-row-1').simulate('click');
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      table.find('a.btn.remove-row-0').simulate('click');
      expect(table.find('tr').length).to.equal(1);
      table.find('a.btn.add-row').simulate('click');
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr').at(0).find('textarea').prop('data-index')).to.equal(0);
      done();
    })

    it('Check multiple textarea with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check multiple textarea without required', function(done) {
      component.validate.required = false;
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      );
      expect(element.find('.formio-component-multiple label ').attr('class')).to.equal('control-label');
      done();
    });

    it('Check multiple textarea without label', function(done) {
      component.label = '';
      const element = render(
        <Textarea
      component={component}
      attachToForm={attachToForm}
        ></Textarea>
      );
      expect(element.find('.formio-component-multiple label').length).to.equal(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Textarea
          component={component}
          attachToForm={attachToForm}
        ></Textarea>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });
  });

});
