
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Panel from '../src/components/panel.jsx';
import sinon from 'sinon';
import form from './forms/empty.json';

var components = require('./forms/componentSpec.js');

describe('Panel', function () {
  describe(' Panel component', function () {
    var component= {
      "input": false,
      "title": "testpanel",
      "theme": "warning",
      "components": [
        components.textfeild,
        components.password,
        components.phoneNumber
      ],
      "type": "panel",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      }
    };
    var attachToForm = sinon.spy();

    it('Renders a basic panel component', function (done) {
      const element = shallow(<Panel
        component={component}
        attachToForm={attachToForm}
        {...this.props} />)
      expect(element.find('.panel').length).to.equal(1);
      done();
    });

    it('Test the theme of panel component', function (done) {
      const element = shallow(<Panel
        component={component}
        attachToForm={attachToForm}
        {...this.props} />).find('.panel');
      expect(element.nodes[0].props.className).to.equal('panel panel-' + component.theme + ' ');
      done();
    });

    it('Test the label of panel component', function (done) {
      const element = shallow(<Panel
        component={component}
        attachToForm={attachToForm}
        {...this.props} />).find('.panel');
      expect(element.nodes[0].props.children[0].props.className).to.equal('panel-heading');
      expect(element.nodes[0].props.children[0].props.children.props.className).to.equal('panel-title');
      done();
    });

    it('Check the nested components of Panel', function (done) {
      const element = shallow(<Panel
        component={component}
        attachToForm={attachToForm}
        {...this.props} />).find('.panel-body');

      //To test type of nested components of panel
      for (var i= 0; i<component.components.length; i++) {
        expect(element.nodes[0].props.children.props.component.components[i].type).to.equal(component.components[i].type);
      }
      done();
    });

  });

});
