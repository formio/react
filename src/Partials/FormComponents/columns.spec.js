import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Columns from './columns.jsx';
import sinon from 'sinon';
import form from '../../../test/forms/empty.json';

var components = require('../../../test/forms/componentSpec.js');

describe('Columns', function () {
  describe(' Columns component', function () {
    var component= {
      "lockKey": true,
      "key": "columns",
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "columns",
      "columns": [
        {
          "components": [
            components.textfeild,
            components.password
          ]
        },
        {
          "components": [
            components.phoneNumber
          ]
        }
      ],
      "input": false
    };
    var attachToForm = sinon.spy();

    it('Renders a basic columns component', function (done) {
      const element = shallow(<Columns
        component={component}
        attachToForm={attachToForm}
      />)

      expect(element.find('.row').length).to.equal(1);
      expect(element.nodes[0].props.children[1].props.className).to.equal('col-sm-6');
      done();
    });

    it('Check number of columns ', function (done) {
      const element = shallow(<Columns
        component={component}
        attachToForm={attachToForm}
      />)

      expect(element.nodes[0].props.children[1].props.children.props.component.columns.length).to.equal(component.columns.length);
      done();
    });

    it('Check the nested components of columns', function (done) {
      const element = shallow(<Columns
        component={component}
        attachToForm={attachToForm}
      />);

      //To test type of nested components of columns
      for (var i= 0; i<component.columns.length; i++) {
        for (var j=0; j<component.columns[i].components.length; j++) {
          expect(element.nodes[0].props.children[1].props.children.props.component.columns[i].components[j].type).to.equal(component.columns[i].components[j].type);
        }
      }

      done();
    });

  });

});
