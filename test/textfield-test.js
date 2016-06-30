import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Formio from '../src/Formio.jsx';

import form from './forms/empty.json';

describe('Textfield', function () {
  describe('Single Textfield', function () {
    var components = [
      {
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
      }
    ];
    it('renders a basic textfield', function (done) {
      form.components = components;
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.form-field-type-textfield');
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-textfield form-group-myTextfield')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-myTextfield');
      expect(element.html()).to.equal('<div class=\"formio-component-single\"><label for=\"myTextfield\" class=\"control-label\">My Textfield</label> <div class=\"input-group\"> <input type=\"text\" class=\"form-control\" id=\"myTextfield\" data-index=\"0\" name=\"myTextfield\" value=\"\" placeholder=\"\" mask=\"\"> </div></div>');
      done();
    });

    it('fills in the placeholder value', function(done) {
      form.components[0].placeholder = 'My Placeholder';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('input#myTextfield');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      form.components[0].placeholder = '';
      done();
    });

    it('renders with a prefix', function(done) {
      form.components[0].prefix = '$';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      form.components[0].prefix = '';
      done();
    });

    it('renders with a suffix', function(done) {
      form.components[0].suffix = 'Pounds';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      form.components[0].suffix = '';
      done();
    });

    it('renders with prefix and suffix', function(done) {
      form.components[0].prefix = 'Prefix';
      form.components[0].suffix = 'Suffix';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.input-group');
      expect(element.children().length).to.equal(3);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('Prefix');
      expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(2).html()).to.equal('Suffix');
      form.components[0].prefix = '';
      form.components[0].suffix = '';
      done();
    });

    it('sets a default value', function(done) {
      form.components[0].defaultValue = 'My Value';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('input');
      expect(element.attr('value')).to.equal('My Value');
      form.components[0].defaultValue = '';
      done();
    });
  });

  describe('Multiple Textfield', function() {
    var components = [
      {
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
      }
    ];
    it('renders a multi-value textfield', function(done) {
      form.components = components;
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.form-field-type-textfield');
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
      expect(table.find('tr td div.input-group input').attr('mask')).to.equal('');
      expect(table.find('tr td div.input-group input').attr('id')).to.equal('myTextfield');
      expect(table.find('tr td div.input-group input').attr('name')).to.equal('myTextfield');
      expect(table.find('tr td div.input-group input').attr('class')).to.equal('form-control');
      expect(table.find('tr td div.input-group input').attr('data-index')).to.equal('0');
      done();
    });

    it('fills in the placeholder value', function(done) {
      form.components[0].placeholder = 'My Placeholder';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('input#myTextfield');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      form.components[0].placeholder = '';
      done();
    });

    it('renders with a prefix', function(done) {
      form.components[0].prefix = '$';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('$');
      form.components[0].prefix = '';
      done();
    });

    it('renders with a suffix', function(done) {
      form.components[0].suffix = 'Pounds';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.input-group');
      expect(element.children().length).to.equal(2);
      expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(1).html()).to.equal('Pounds');
      form.components[0].suffix = '';
      done();
    });

    it('renders with prefix and suffix', function(done) {
      form.components[0].prefix = 'Prefix';
      form.components[0].suffix = 'Suffix';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('.input-group');
      expect(element.children().length).to.equal(3);
      expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(0).html()).to.equal('Prefix');
      expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
      expect(element.children().eq(2).html()).to.equal('Suffix');
      form.components[0].prefix = '';
      form.components[0].suffix = '';
      done();
    });

    it('sets a default value', function(done) {
      form.components[0].defaultValue = 'My Value';
      const wrapper = render(<Formio form={form}></Formio>);
      const element = wrapper.find('input');
      expect(element.attr('value')).to.equal('My Value');
      form.components[0].defaultValue = '';
      done();
    });

    // Check adding additional values
  });

  // Check validations
});
