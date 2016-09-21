import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Select from './select.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Select Field', function () {
  describe('Select Compoennt', function () {
    var component= {
      "input": true,
      "tableView": true,
      "label": "",
      "key": "select",
      "placeholder": "",
      "data": {
        "values": [
          {
            "value": "a",
            "label": "a"
          },
          {
            "value": "b",
            "label": "b"
          },
          {
            "value": "c",
            "label": "c"
          },
          {
            "value": "d",
            "label": "d"
          }
        ],
        "json": "",
        "url": "",
        "resource": ""
      },
      "dataSrc": "values",
      "valueProperty": "",
      "defaultValue": "",
      "refreshOn": "",
      "filter": "",
      "authenticate": false,
      "template": "<span>{{ item.label }}</span>",
      "multiple": false,
      "protected": true,
      "unique": false,
      "persistent": true,
      "validate": {
        "required": false
      },
      "type": "select",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();

    it('Render a basic select component', function (done) {
      const element = render(
        <Select
          component={component}
          attachToForm={attachToForm}
        ></Select>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-select form-group-select')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-select');
      done();
    });

    it('Check the label of the select component', function (done) {
      component.label = 'Select component'
      const element = render(
        <Select
          component={component}
          attachToForm={attachToForm}
        ></Select>
      ).find('.control-label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(1);
      done();
    });

    it('Check with out label for select component', function (done) {
      component.label = null;
      const element = render(
        <Select
          component={component}
          attachToForm={attachToForm}
        ></Select>
      ).find('label');
      expect(element.html()).to.equal(component.label);
      expect(element).to.have.length(0);
      done();
    });

    it('Check the dropdown and check the number of options of select component', function(done) {
      const element = mount(
        <Select
          component={component}
          attachToForm={attachToForm}
        ></Select>
      );
      expect(element.find('.rw-open')).to.have.length(0);
      element.find('.rw-i-caret-down').simulate('click');
      expect(element.find('.rw-open')).to.have.length(1);
      expect(element.find('.rw-popup')).to.have.length(1);

      //To check the number of options for select component

      expect(element.find('.rw-popup ul li').length).to.equal(component.data.values.length);
      done();
    });

    it('Render a multiple select component ', function (done) {
      component.multiple = true;
      const element = render(
        <Select
          component={component}
          attachToForm={attachToForm}
        ></Select>
      ).find('.rw-multiselect-wrapper');
      expect(element).to.have.length(1);
      component.multiple = false;
      done();
    });

  });

});
