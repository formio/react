import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Fieldset from '../src/components/fieldset.jsx';
import sinon from 'sinon';
import form from './forms/empty.json';

var components = require('./forms/componentSpec.js');

describe('Fieldset', function () {
  describe(' Fieldset component', function () {
    var component= {
      "input": false,
      "tableView": true,
      "legend": "",
      "components": [
        components.textfeild,
        components.password,
        components.phoneNumber
      ],
      "type": "fieldset",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();

    it('Renders a basic fieldset component', function (done) {
      const element = shallow(<Fieldset
        component={component}
        attachToForm={attachToForm}
        />)
      expect(element.find('fieldset').length).to.equal(1);
      done();
    });

    it('Check with legend for fieldset component', function (done) {
      component.legend = 'My fieldset';
      const element = shallow(<Fieldset
        component={component}
        attachToForm={attachToForm}
        />)
      expect(element.find('legend').length).to.equal(1);
      done();
    });

    it('Check without legend for fieldset component', function (done) {
      component.legend = '';
      const element = shallow(<Fieldset
        component={component}
        attachToForm={attachToForm}
         />)
      expect(element.find('legend').length).to.equal(0);
      done();
    });

    it('Check the nested components of fieldset', function (done) {
      const element = shallow(<Fieldset
        component={component}
        attachToForm={attachToForm}
       />);

      //To test type of nested components of fieldset
      for (var i= 0; i<component.components.length; i++) {
        expect(element.nodes[0].props.children[1].props.component.components[i].type).to.equal(component.components[i].type);
      }
      done();
    });

  });

});
