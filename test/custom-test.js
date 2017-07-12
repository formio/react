import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Custom from '../src/components/custom.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Custom', function () {
  describe('Custom field', function () {
    var component= {
      "persistent": true,
      "protected": false,
      "key": "custom",
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "custom"
    };
    var attachToForm = sinon.spy();

    it('Renders a basic custom component', function (done) {
      const element = render(
        <Custom
          component={component}
          attachToForm={attachToForm}
        ></Custom>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('panel panel-default')).to.equal(true);
      done();
    });

  });

});
