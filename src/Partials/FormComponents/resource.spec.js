
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Resource from './resource.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

// To pass project url as Formio props.
var projectUrl = {projectUrl : 'https://calcxokkdyhwybb.form.io'};

describe('Resource field', function () {
  describe('Single resource component', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "resource",
      "defaultPermission": "",
      "validate": {
        "required": false
      },
      "persistent": true,
      "protected": false,
      "multiple": false,
      "searchFields": "",
      "selectFields": "",
      "template": "<span>{{ item.data.company }}</span>",
      "defaultValue": "",
      "project": "57ac74515b7a477b00271f88",
      "resource": "57ac76b85b7a477b00271f97",
      "placeholder": "",
      "key": "testResource",
      "label": "testResource",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Renders a basic resource component', function (done) {
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-resource form-group-testResource')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-testResource');
      done();
    });

    it('Check single resource component', function (done) {
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).find('.rw-dropdownlist');
      expect(element).to.have.length(1);
      done();
    });

    it('Check the dropdown of resource component', function(done) {
      const element = mount(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-i-caret-down').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      element.find('.rw-dropdownlist').simulate('click');
      expect(element.find('.rw-open')).to.have.length(0);
      done();
    });

    it('Check the by default value of the dropdown search component', function(done) {
      const element = mount(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-i-caret-down').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      expect(element.find('.rw-list-empty').html()).to.equal('<li class="rw-list-empty">There are no items in this list</li>');
      done();
    });

    it('Check with label for resource component', function (done) {
      component.label = 'Test Label';
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).find('.control-label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(1);
      done();
    });

    it('Check without label for resource component', function (done) {
      component.label = null;
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).find('.control-label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  });

  describe('Multiple resource component', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "resource",
      "defaultPermission": "",
      "validate": {
        "required": false
      },
      "persistent": true,
      "protected": false,
      "multiple": true,
      "searchFields": "",
      "selectFields": "",
      "template": "<span>{{ item.data.company }}</span>",
      "defaultValue": "",
      "project": "57ac74515b7a477b00271f88",
      "resource": "57ac76b85b7a477b00271f97",
      "placeholder": "",
      "key": "testResource",
      "label": "testResource",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Render multiple resource component', function (done) {
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).find('.rw-multiselect-wrapper');
      expect(element).to.have.length(1);
      done();
    });

    it('Check the dropdown of multiple resource component', function(done) {
      const element = mount(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-input').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      done();
    });

    it('Check the by default value of the dropdown resource component', function(done) {
      const element = mount(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-input').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);
      expect(element.find('.rw-list-empty').html()).to.equal('<li class="rw-list-empty">There are no items in this list</li>');
      done();
    });

    it('Check with label for resource component', function (done) {
      component.label = 'Test Label';
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).find('.control-label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(1);
      done();
    });

    it('Check without label for resource component', function (done) {
      component.label = null;
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).find('.control-label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(0);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Resource
          component={component}
          attachToForm={attachToForm}
          formio={projectUrl}
        ></Resource>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  });
});
