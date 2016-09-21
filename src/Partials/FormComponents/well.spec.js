import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Well from './well.jsx';
import sinon from 'sinon';
import form from '../../../test/forms/empty.json';

var components = require('../../../test/forms/componentSpec.js');

describe('Well', function () {
  describe(' Well component', function () {
    var component= {
      "lockKey": true,
      "key": "well",
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "well",
      "components": [
        components.textfeild,
        components.password,
        components.phoneNumber
      ],
      "input": false
    };
    var attachToForm = sinon.spy();

    it('Renders a basic well component', function (done) {
      const element = shallow(<Well
        component={component}
        attachToForm={attachToForm}
        />)
      expect(element.find('.well').length).to.equal(1);
      done();
    });

    it('Check the nested components of well', function (done) {
      const element = shallow(<Well
        component={component}
        attachToForm={attachToForm}
        />).find('.well');

      //To test type of nested components of well
      for (var i= 0; i<component.components.length; i++) {
        expect(element.nodes[0].props.children.props.component.components[i].type).to.equal(component.components[i].type);
      }
      done();
    });

  });

});
