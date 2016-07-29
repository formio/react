import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Button from '../src/components/button.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Button', function () {
  describe('Button field', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "button",
      "theme": "success",
      "disableOnInvalid": true,
      "action": "submit",
      "block": false,
      "rightIcon": "",
      "leftIcon": "",
      "size": "sm",
      "key": "submit",
      "tableView": false,
      "label": "Submit",
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Renders a button component', function (done) {
      const element = render(
        <Button
      component={component}
      attachToForm={attachToForm}
        ></Button>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('btn btn-success btn-sm')).to.equal(true);
      done();
    });

    it('Check the type of rendred button component', function (done) {
      const element = render(
        <Button
      component={component}
      attachToForm={attachToForm}
        ></Button>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.attr('type')).to.equal(component.action);
      done();
    });

    it('Check the theme of rendred button component', function (done) {
      const element = render(
        <Button
      component={component}
      attachToForm={attachToForm}
        ></Button>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('btn btn-'+ component.theme +' btn-sm')).to.equal(true);
      done();
    });

    it('Check the size of rendred button component', function (done) {
      const element = render(
        <Button
      component={component}
      attachToForm={attachToForm}
        ></Button>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('btn btn-success btn-' + component.size)).to.equal(true);
      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Button
          component={component}
          attachToForm={attachToForm}
        ></Button>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  });

});
