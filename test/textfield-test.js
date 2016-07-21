import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Textfield from '../src/components/textfield.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Textfield', function () {
  describe('Single Textfield', function () {
    var component= {
      'input': true,
      'tableView': true,
      'inputType': 'text',
      'inputMask': '',
      'label': 'My Textfield',
      'key': 'myTextfield',
      'placeholder': '',
      'prefix': '',
      'suffix': '',
      'multiple': false,
      'defaultValue': '',
      'protected': false,
      'unique': false,
      'persistent': true,
      'validate': {
        'required': false,
        'minLength': '',
        'maxLength': '',
        'pattern': '',
        'custom': '',
        'customPrivate': false
      },
      'conditional': {
        'show': null,
        'when': null,
        'eq': ''
      },
      'type': 'textfield'
    };
    var attachToForm = sinon.spy();
    it('renders a basic textfield', function (done) {
      const element = render(
        <Textfield
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-textfield form-group-myTextfield')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-myTextfield');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single label').length).to.equal(1);
      expect(element.find('.formio-component-single label').html()).to.equal('My Textfield');
      expect(element.find('.formio-component-single label').attr('for')).to.equal('myTextfield');
      expect(element.find('.formio-component-single .input-group').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').attr('type')).to.equal('text');
      expect(element.find('.formio-component-single .input-group input').attr('class')).to.equal('form-control');
      expect(element.find('.formio-component-single .input-group input').attr('id')).to.equal('myTextfield');
      expect(element.find('.formio-component-single .input-group input').attr('data-index')).to.equal('0');
      expect(element.find('.formio-component-single .input-group input').attr('value')).to.equal('');
      expect(element.find('.formio-component-single .input-group input').attr('placeholder')).to.equal('');
      done();
    });

    it('fills in the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <Textfield
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('input#myTextfield');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });
  
    it('renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Textfield
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      component.prefix = '';
      done();
    });
  
    it('renders with a suffix', function(done) {
      component.suffix = 'Pounds';
      const element = render(
        <Textfield
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      component.suffix = '';
      done();
    });

    it('renders with prefix and suffix', function(done) {
      component.prefix = 'Prefix';
      component.suffix = 'Suffix';
      const element = render(
        <Textfield
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
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

    it('sets a default value', function(done) {
      const element = render(
        <Textfield
          component={component}
          value='My Value'
          attachToForm={attachToForm}
        ></Textfield>
      ).find('input');
      expect(element.attr('value')).to.equal('My Value');
      done();
    });
  });

  describe('Multiple Textfield', function() {
    var component = {
      'input': true,
      'tableView': true,
      'inputType': 'text',
      'inputMask': '',
      'label': 'My Textfield',
      'key': 'myTextfield',
      'placeholder': '',
      'prefix': '',
      'suffix': '',
      'multiple': true,
      'defaultValue': '',
      'protected': false,
      'unique': false,
      'persistent': true,
      'validate': {
        'required': false,
        'minLength': '',
        'maxLength': '',
        'pattern': '',
        'custom': '',
        'customPrivate': false
      },
      'conditional': {
        'show': null,
        'when': null,
        'eq': ''
      },
      'type': 'textfield'
    };
    var attachToForm = sinon.spy();
    it('renders a multi-value textfield', function(done) {
      const element = render(
        <Textfield
          name="myTextfield"
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('.form-field-type-textfield');
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-textfield form-group-myTextfield')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-myTextfield');
      expect(element.children().eq(0).hasClass('formio-component-multiple')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).attr('for')).to.equal('myTextfield');
      expect(element.children().eq(0).children().eq(0).hasClass('control-label')).to.equal(true);
      expect(element.children().eq(0).children().eq(0).text()).to.equal('My Textfield');
      const table = element.children().eq(0).children().eq(1);
      expect(table.hasClass('table table-bordered')).to.equal(true);
      expect(table.find('tr').length).to.equal(2);
      expect(table.find('tr td div.input-group').length).to.equal(1);
      expect(table.find('tr td div.input-group input').attr('type')).to.equal('text');
      expect(table.find('tr td div.input-group input').attr('placeholder')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('value')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('id')).to.equal('myTextfield');
      expect(table.find('tr td div.input-group input').attr('name')).to.equal('myTextfield');
      expect(table.find('tr td div.input-group input').attr('class')).to.equal('form-control');
      expect(table.find('tr td div.input-group input').attr('data-index')).to.equal('0');
      done();
    });

    it('fills in the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <Textfield
          name="myTextfield"
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('input#myTextfield');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });

    it('renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Textfield
          name="myTextfield"
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      component.prefix = '';
      done();
    });

    it('renders with a suffix', function(done) {
      component.suffix = 'Pounds';
      const element = render(
        <Textfield
          name="myTextfield"
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      component.suffix = '';
      done();
    });

    it('renders with prefix and suffix', function(done) {
      component.prefix = 'Prefix';
      component.suffix = 'Suffix';
      const element = render(
        <Textfield
          name="myTextfield"
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
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

    it('sets a default value', function(done) {
      const element = render(
        <Textfield
          name="myTextfield"
          value="My Value"
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('input');
      expect(element.attr('value')).to.equal('My Value');
      done();
    });

    it('adds and removes rows', function(done) {
      component.defaultValue = 'My Value';
      const element = mount(
        <Textfield
          name="myTextfield"
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('.form-field-type-textfield');
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
  });

  // Check validations/alerts

  // Check change event

  // Check with and without labels/required
});
