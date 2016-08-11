import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Address from '../src/components/address.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Address field', function () {
  describe('Single address component', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "address",
      "validate": {
        "required": false
      },
      "map": {
        "key": "",
        "region": ""
      },
      "persistent": true,
      "unique": false,
      "protected": false,
      "multiple": false,
      "placeholder": "",
      "key": "test",
      "label": "test",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Renders a basic address component', function (done) {
      const element = render(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-address form-group-test')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-test');
      done();
    });

    it('Check single addess component', function (done) {
      const element = render(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      ).find('.rw-dropdownlist');
      expect(element).to.have.length(1);
      done();
    });

    it('Check the dropdown of address field', function(done) {
      const element = mount(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-i-caret-down').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      element.find('.rw-dropdownlist').simulate('click');
      expect(element.find('.rw-open')).to.have.length(0);
      done();
    });

    it('Check the by default value of the dropdown search field', function(done) {
      const element = mount(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-i-caret-down').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      expect(element.find('.rw-list-empty').html()).to.equal('<li class="rw-list-empty">There are no items in this list</li>');
      done();
    });

    it('Insert the value inside a textfield', function(done) {
      const element = mount(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-i-caret-down').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      expect(element.find('.rw-popup input')).to.have.length(1);

      //To check the simulate the value change
      element.find('.rw-popup input').simulate('change', {target: {value: 's'}});

      done();
    });

  });

  describe('Multiple address component', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "address",
      "validate": {
        "required": false
      },
      "map": {
        "key": "",
        "region": ""
      },
      "persistent": true,
      "unique": false,
      "protected": false,
      "multiple": true,
      "placeholder": "",
      "key": "test",
      "label": "test",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Check multiple addess component ', function (done) {
      const element = render(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      ).find('.rw-multiselect-wrapper');
      expect(element).to.have.length(1);
      done();
    });

    it('Check the dropdown of multiple address field', function(done) {
      const element = mount(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-input').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      element.find('.rw-input').simulate('change', {target: {value: 's'}});
      expect(element.find('.rw-list-empty').html()).to.equal('<li class="rw-list-empty">There are no items in this list</li>');
      done();
    });

    it('Check the by default value of the dropdown search field', function(done) {
      const element = mount(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-input').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      expect(element.find('.rw-list-empty').html()).to.equal('<li class="rw-list-empty">There are no items in this list</li>');
      done();
    });

    it('Insert the value inside a textfield', function(done) {
      const element = mount(
        <Address
          component={component}
          attachToForm={attachToForm}
        ></Address>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-input').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);

      //To check the simulate the value change
      element.find('.rw-input').simulate('change', {target: {value: 's'}});

      done();
    });

// TODO: Write a test case to check empty search field for first occurance of multiple address component.
  });

});