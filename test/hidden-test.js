

import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Hidden from '../src/components/hidden.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Hidden', function () {
  describe('Hidden field', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "hidden",
      "persistent": true,
      "unique": false,
      "protected": true,
      "label": "test hidden",
      "key": "hidden",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Renders a hidden field', function (done) {
      const element = render(
        <Hidden
      component={component}
      attachToForm={attachToForm}
        ></Hidden>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-hidden form-group-hidden')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-hidden');
      done();
    });

    it('Check the attributes of the hidden input', function(done) {
      const element = render(
        <Hidden
      component={component}
      attachToForm={attachToForm}
        ></Hidden>
      ).find('input');
      expect(element.attr('value')).to.equal('');
      expect(element.attr('type')).to.equal('hidden');
      expect(element.attr('id')).to.equal('hidden');
      expect(element.attr('name')).to.equal('hidden');
      done();
    });

    it('Sets a default value of the hidden input', function(done) {
      const element = render(
        <Hidden
      value="My Value"
      component={component}
      attachToForm={attachToForm}
        ></Hidden>
      ).find('input');
      expect(element.attr('value')).to.equal('My Value');
      done();
    });

  });

});
