
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Password from '../src/components/password.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Password', function () {
  describe('Password field', function () {
    var component= {
      'input': true,
      'tableView': false,
      'inputType': 'password',
      'label': 'Password',
      'key': 'password',
      'placeholder': '',
      'prefix': '',
      'suffix': '',
      'protected': true,
      "persistent": true,
      'inputMask': '',
      'multiple': false,
      'defaultValue': '',
      'unique': false,
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
      'type': 'password'
    };
    var attachToForm = sinon.spy();
    it('Renders a password field', function (done) {
      const element = render(
        <Password
          component={component}
          attachToForm={attachToForm}
        ></Password>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-password form-group-password')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-password');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single label').length).to.equal(1);
      expect(element.find('.formio-component-single label').html()).to.equal('Password');
      expect(element.find('.formio-component-single label').attr('for')).to.equal('password');
      expect(element.find('.formio-component-single .input-group').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group input').attr('type')).to.equal('password');
      expect(element.find('.formio-component-single .input-group input').attr('class')).to.equal('form-control');
      expect(element.find('.formio-component-single .input-group input').attr('id')).to.equal('password');
      expect(element.find('.formio-component-single .input-group input').attr('data-index')).to.equal('0');
      expect(element.find('.formio-component-single .input-group input').attr('value')).to.equal('');
      expect(element.find('.formio-component-single .input-group input').attr('placeholder')).to.equal('');
      done();
    });

    it('Update the placeholder value', function(done) {
      component.placeholder = 'My Placeholder';
      const element = render(
        <Password
          component={component}
          attachToForm={attachToForm}
        ></Password>
      ).find('input#password');
      expect(element.attr('placeholder')).to.equal('My Placeholder');
      component.placeholder = '';
      done();
    });


    it('Renders with a prefix', function(done) {
      component.prefix = '$';
      const element = render(
        <Password
          component={component}
          attachToForm={attachToForm}
        ></Password>
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
        <Password
          component={component}
          attachToForm={attachToForm}
        ></Password>
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
        <Password
          component={component}
          attachToForm={attachToForm}
        ></Password>
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
        <Password
          name="password"
          value="My Value"
          component={component}
          attachToForm={attachToForm}
        ></Password>
      ).find('input');
      expect(element.attr('value')).to.equal('My Value');
      done();
    });

    it('Renders with maxLength', function(done) {
      component.validate.maxLength = '20';
      const element = render(
        <Password
          name="password"
          value="test maximum length"
          component={component}
          attachToForm={attachToForm}
        ></Password>
      ).find('input');
      expect(element.attr('value').length).to.be.at.most(component.validate.maxLength);
      component.validate.maxLength = '';
      done();
    });

    it('Renders with minLength', function(done) {
      component.validate.minLength = '4';
      const element = render(
        <Password
          name="password"
          value="Test minimum length"
          component={component}
          attachToForm={attachToForm}
        ></Password>
      ).find('input');
      expect(element.attr('value').length).to.be.at.least(component.validate.minLength);
      component.validate.minLength = '';
      done();
    });

  });

});
