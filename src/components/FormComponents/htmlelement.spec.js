import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Htmlelement from './htmlelement.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Htmlelement', function () {
  describe('Htmlelement field', function () {
    var component= {
      "input": false,
      "tag": "button",
      "attrs": [
        {
          "attr": "",
          "value": ""
        }
      ],
      "customClass": "htmlelement",
      "content": "",
      "type": "htmlelement",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();

    it('Renders a htmlelement component', function (done) {
      const element = render(
        <Htmlelement
      component={component}
      attachToForm={attachToForm}
        ></Htmlelement>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.find(component.tag).length).to.equal(1);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Htmlelement
          component={component}
          attachToForm={attachToForm}
        ></Htmlelement>
      ).children().eq(0);
      expect(element.find(component.tag).attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

    it('assigns custom attributes', function(done) {
      component.attrs = [
        {
          attr: 'id',
          value: 'value'
        },
        {
          attr: 'name',
          value: 'bar'
        }
      ]
      const element = render(
        <Htmlelement
          component={component}
          attachToForm={attachToForm}
        ></Htmlelement>
      ).children().eq(0);
      expect(element.find(component.tag).attr('id')).to.equal('value');
      expect(element.find(component.tag).attr('name')).to.equal('bar');
      done();
    });

  //  To Do :- Need to implement the test cases for attributes of html elements.
  });

});
