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
      "className": "htmlelement",
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
      expect(element.hasClass('form-group form-field-type-htmlelement form-group-undefined')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-undefined');
      expect(element.find('.formio-component-single').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group ').length).to.equal(1);
      expect(element.find('.formio-component-single .input-group ' + component.tag).length).to.equal(1);
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
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  //  To Do :- Need to implement the test cases for attributes of html elements.
  });

});
