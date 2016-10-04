import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Container from './container.jsx';
import sinon from 'sinon';
import form from '../../../test/forms/empty.json';

var components = require('../../../test/forms/componentSpec.js');

describe('Container', function () {
  describe(' Container component', function () {
    var component= {
      "input": true,
      "tree": true,
      "components": [
        components.textfeild,
        components.password,
        components.phoneNumber
      ],
      "tableView": true,
      "label": "container",
      "key": "container",
      "protected": true,
      "persistent": true,
      "type": "container",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();

    it('Renders a basic container', function (done) {
      const element = shallow(<Container
        component={component}
        attachToForm={attachToForm}
        />)
      expect(element.find('.form-group .form-field-type-container .form-group-container').length).to.equal(1);
      expect(element.find('.form-group .form-field-type-container .form-group-container .formio-container').length).to.equal(1);
      done();
    });

    it('Check the nested components of container', function (done) {
      const element = shallow(<Container
        component={component}
        attachToForm={attachToForm}
        />).find('.form-group .form-field-type-container .form-group-container .formio-container');

      //To test type of nested components of container
      for (var i= 0; i<component.components.length; i++) {
        expect(element.nodes[0].props.children.props.component.components[i].type).to.equal(component.components[i].type);
      }
      done();
    });

  });

});
