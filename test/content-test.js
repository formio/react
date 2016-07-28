
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Content from '../src/components/content.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Content', function () {
  describe('Content field', function () {
    var component= {
      "input": false,
      "html": "<p>Test p tag and<strong>strong tag</strong></p>\n",
      "type": "content",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      },
      "key": "testContent",
      "lockKey": true
    };
    var attachToForm = sinon.spy();

    it('Renders a content component', function (done) {
      const element = render(
        <Content
      component={component}
      attachToForm={attachToForm}
        ></Content>
      ).find('div');
      expect(element).to.have.length(1);
      done();
    });

    it('Check the html for content component', function(done) {
      const element = render(
        <Content
      component={component}
      attachToForm={attachToForm}
        ></Content>
      ).find('div');
      expect(element.html()).to.equal(component.html);
      done();
    });

  });

});
