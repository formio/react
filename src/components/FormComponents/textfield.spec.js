import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Textfield from './textfield.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Textfield @textfield', function () {
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

    it('sets the initial state correctly', function(done) {
      const element = mount(
        <Textfield
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      );
      expect(element.state('isPristine')).to.be.true;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      expect(element.state('value')).to.equal('');
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
      component.defaultValue = 'My Value';
      const element = render(
        <Textfield
          component={component}
          value={null}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('input');
      expect(element.attr('value')).to.equal('My Value');
      component.defaultValue = '';
      done();
    });

    it('requires required fields', function(done) {
      component.validate.required = true;
      const element = mount(
        <Textfield
          name="myTextfield"
          value=""
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      );
      expect(element.state('isPristine')).to.be.true;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield is required.');
      element.find('input').simulate('change', {target: {value: 'My Value'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      expect(element.state('value')).to.equal('My Value');
      element.find('input').simulate('change', {target: {value: ''}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield is required.');
      expect(element.state('value')).to.equal('');
      component.validate.required = false;
      done();
    });

    it('initially fulfills required fields with default values', function(done) {
      component.defaultValue = 'My Value'
      component.validate.required = true;
      const element = mount(
        <Textfield
          name="myTextfield"
          value={null}
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      );
      expect(element.state('isPristine')).to.be.true;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      element.find('input').simulate('change', {target: {value: ''}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield is required.');
      expect(element.state('value')).to.equal('');
      component.validate.required = false;
      component.defaultValue = '';
      done();
    });

    it('validates maxLength', function(done) {
      component.validate.maxLength = '5';
      const element = mount(
        <Textfield
          name="myTextfield"
          value=""
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      );
      expect(element.state('isPristine')).to.be.true;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      element.find('input').simulate('change', {target: {value: 'My Value'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield cannot be longer than 5 characters.');
      expect(element.state('value')).to.equal('My Value');
      element.find('input').simulate('change', {target: {value: 'ABCDE'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      expect(element.state('value')).to.equal('ABCDE');
      component.validate.maxLength = '';
      done();
    });

    it('validates minLength', function(done) {
      component.validate.minLength = '5';
      const element = mount(
        <Textfield
          name="myTextfield"
          value=""
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      );
      expect(element.state('isPristine')).to.be.true;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield cannot be shorter than 5 characters.');
      element.find('input').simulate('change', {target: {value: 'My Value'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      expect(element.state('value')).to.equal('My Value');
      element.find('input').simulate('change', {target: {value: 'ABCD'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield cannot be shorter than 5 characters.');
      expect(element.state('value')).to.equal('ABCD');
      element.find('input').simulate('change', {target: {value: ''}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield cannot be shorter than 5 characters.');
      expect(element.state('value')).to.equal('');
      component.validate.minLength = '';
      done();
    });

    it('validates minLength and maxLength', function(done) {
      component.validate.minLength = '5';
      component.validate.maxLength = '10';
      const element = mount(
        <Textfield
          name="myTextfield"
          value=""
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      );
      expect(element.state('isPristine')).to.be.true;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield cannot be shorter than 5 characters.');
      element.find('input').simulate('change', {target: {value: 'My Value'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.true;
      expect(element.state('errorMessage')).to.equal('');
      expect(element.state('value')).to.equal('My Value');
      element.find('input').simulate('change', {target: {value: 'ABCDEFGHIJKLMNOPQRS'}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield cannot be longer than 10 characters.');
      expect(element.state('value')).to.equal('ABCDEFGHIJKLMNOPQRS');
      element.find('input').simulate('change', {target: {value: ''}});
      expect(element.state('isPristine')).to.be.false;
      expect(element.state('isValid')).to.be.false;
      expect(element.state('errorMessage')).to.equal('My Textfield cannot be shorter than 5 characters.');
      expect(element.state('value')).to.equal('');
      component.validate.minLength = '';
      component.validate.maxLength = '';
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Textfield
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      component.customClass = '';
      done();
    });

    it('fires a change event @change', function(done) {
      const onChange = sinon.spy();
      const element = mount(
        <Textfield
          component={component}
          onChange={onChange}
        ></Textfield>
      );
      expect(element.state('value')).to.equal('');
      expect(onChange.callCount).to.equal(1);
      element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
      element.find('input[type="text"]').simulate('blur');
      expect(element.state('value')).to.equal('My Value');
      expect(onChange.callCount).to.equal(2);
      element.find('input[type="text"]').simulate('change', {target: {value: ''}});
      element.find('input[type="text"]').simulate('blur');
      expect(element.state('value')).to.equal('');
      expect(onChange.callCount).to.equal(3);
      done();
    });

    it('fires a change event with skipInit @change', function(done) {
      const onChange = sinon.spy();
      const element = mount(
        <Textfield
          options={{ skipInit: true }}
          component={component}
          onChange={onChange}
        ></Textfield>
      );
      expect(element.state('value')).to.equal('');
      element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
      element.find('input[type="text"]').simulate('blur');
      expect(element.state('value')).to.equal('My Value');
      expect(onChange.callCount).to.equal(1);
      element.find('input[type="text"]').simulate('change', {target: {value: ''}});
      element.find('input[type="text"]').simulate('blur');
      expect(element.state('value')).to.equal('');
      expect(onChange.callCount).to.equal(2);
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
      component.defaultValue = 'My Value';
      const element = render(
        <Textfield
          name="myTextfield"
          value={null}
          component={component}
          attachToForm={attachToForm}
        ></Textfield>
      ).find('input');
      expect(element.attr('value')).to.equal('My Value');
      component.defaultValue = '';
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
      component.defaultValue = '';
      done();
    })


    it('fires a change event @change', function(done) {
      const onChange = sinon.spy();
      const element = mount(
        <Textfield
          component={component}
          onChange={onChange}
        ></Textfield>
      );
      expect(element.state('value').length).to.equal(1);
      expect(element.state('value')[0]).to.equal('');
      expect(onChange.callCount).to.equal(1);
      const table = element.find('table');
      table.find('tr').at(0).find('input').simulate('change', {target: {value: 'My Value', getAttribute: () => 0}});
      table.find('tr').at(0).find('input').simulate('blur');
      expect(onChange.callCount).to.equal(2);
      table.find('a.btn.add-row').simulate('click');
      expect(onChange.callCount).to.equal(3);
      table.find('tr').at(0).find('input').simulate('change', {target: {value: '', getAttribute: () => 0}});
      table.find('tr').at(0).find('input').simulate('blur');
      expect(onChange.callCount).to.equal(4);
      done();
    });

    it('fires a change event with skipInit @change', function(done) {
      const onChange = sinon.spy();
      const element = mount(
        <Textfield
          options={{ skipInit: true }}
          component={component}
          onChange={onChange}
        ></Textfield>
      );
      expect(element.state('value').length).to.equal(1);
      expect(element.state('value')[0]).to.equal('');
      expect(onChange.callCount).to.equal(0);
      const table = element.find('table');
      table.find('tr').at(0).find('input').simulate('change', {target: {value: 'My Value', getAttribute: () => 0}});
      table.find('tr').at(0).find('input').simulate('blur');
      expect(onChange.callCount).to.equal(1);
      table.find('a.btn.add-row').simulate('click');
      expect(onChange.callCount).to.equal(2);
      table.find('tr').at(0).find('input').simulate('change', {target: {value: '', getAttribute: () => 0}});
      table.find('tr').at(0).find('input').simulate('blur');
      expect(onChange.callCount).to.equal(3);
      done();
    });
  });

  // Check with and without labels/required
});
