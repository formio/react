
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Selectboxes from '../src/components/selectboxes.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Selectboxes', function () {
  describe('Selectboxes field', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "selectboxes",
      "validate": {
        "required": false
      },
      "persistent": true,
      "protected": false,
      "inline": false,
      "values": [
        {
          "label": "firstSelectbox",
          "value": "firstSelectbox-value"
        },
        {
          "label": "secondSelectbox",
          "value": "secondSelectbox-value"
        },
        {
          "label": "thirdSelectbox",
          "value": "thirdSelectbox-value"
        }
      ],
      "key": "selectBox",
      "label": "selectBox",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Renders a selectboxes field', function (done) {
      const element = render(
        <Selectboxes
      component={component}
      attachToForm={attachToForm}
        ></Selectboxes>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-selectboxes form-group-selectBox')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-selectBox');
      expect(element.find('.selectbox').length).to.equal(1);
      expect(element.find('.checkbox').length).to.equal(component.values.length);
      done();
    });

    it('Check the label value for each selectbox component', function(done) {
      const element = render(
        <Selectboxes
      component={component}
      attachToForm={attachToForm}
        ></Selectboxes>
      );
      expect(element.find('.checkbox').length).to.equal(component.values.length);
      expect(element.find('.checkbox label input').attr("type")).to.equal('checkbox');

      //To test the label of each select boxes
      for (var i= 0; i<component.values.length; i++) {
        expect(element.find('.checkbox label input ')[i].next.data).to.equal(component.values[i].label);
      }

      done();
    });

    it('Check the validations with required', function(done) {
      component.validate.required = true;
      const element = render(
        <Selectboxes
      component={component}
      attachToForm={attachToForm}
        ></Selectboxes>
      ).find('label').eq(0);
      expect(element.attr('class')).to.equal('control-label field-required');
      done();
    });

    it('Check the validations with out required', function(done) {
      component.validate.required = false;
      const element = render(
        <Selectboxes
      component={component}
      attachToForm={attachToForm}
        ></Selectboxes>
      ).find('label').eq(0);
      expect(element.attr('class')).to.equal('control-label');
      done();
    });

    it('Check single Selectboxes with label', function(done) {
      component.label = 'test Label';
      const element = render(
        <Selectboxes
      component={component}
      attachToForm={attachToForm}
        ></Selectboxes>
      ).find('label').eq(0);
      expect(element.attr('class')).to.equal('control-label');
      expect(element.length).to.equal(1);
      done();
    });

  });

});
