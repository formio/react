import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Datagrid from './datagrid.jsx';
import sinon from 'sinon';
import form from '../../../test/forms/empty.json';

var components = require('../../../test/forms/componentSpec.js');

describe('Datagrid', function () {
  describe(' Datagrid component', function () {
    var component= {
      "input": true,
      "tree": true,
      "components": [],
      "tableView": true,
      "label": "testLabel",
      "key": "testLabel",
      "protected": true,
      "persistent": true,
      "type": "datagrid",
      "conditional": {
        "show": "",
        "when": null,
        "eq": ""
      },
      "addAnother": "",
      "condensed": true,
      "hover": true,
      "bordered": true,
      "striped": true,
      "isNew": false
    };
    var attachToForm = sinon.spy();

    it('Renders a basic datagrid', function (done) {
      const element = shallow(<Datagrid
      component={component}
      attachToForm={attachToForm}
        />)
      expect(element.hasClass('form-group form-field-type-datagrid')).to.equal(true);
      done();
    });

    it('Check with label for datagrid component', function (done) {
      component.label = 'My datagrid';
      const element = shallow(<Datagrid
        component={component}
        attachToForm={attachToForm}
      />).find('.formio-data-grid');

      //Need to take the count of default label.
      expect(element.find('.control-label').length).to.equal(2);
      done();
    });

    it('Check without label for datagrid component', function (done) {
      component.label = '';
      const element = shallow(<Datagrid
        component={component}
        attachToForm={attachToForm}
      />).find('.formio-data-grid');

      //Need to take the count of default label.
      expect(element.find('.control-label').length).to.equal(1);
      done();
    });

    it('Check the without table classes of datagrid element ', function (done) {
      const element = shallow(<Datagrid
        component={component}
        attachToForm={attachToForm}
      />).find('table');
      expect(element.hasClass('table datagrid-table')).to.equal(true);
      done();
    });

    it('Check the with table classes of datagrid element ', function (done) {
      component.condensed = true;
      component.hover = true;
      component.bordered = true;
      component.striped = true;

      const element = shallow(<Datagrid
        component={component}
        attachToForm={attachToForm}
      />).find('table');
      expect(element.hasClass('table datagrid-table table-striped table-bordered table-hover table-condensed')).to.equal(true);
      done();
    });

    it('Check the nested components of datagrid', function (done) {
      component.components = [
        components.textfeild,
        components.password,
        components.phoneNumber
      ];
      const element = shallow(<Datagrid
      component={component}
      attachToForm={attachToForm}
        />).find('.table');

      //To test type of nested components of datagrid
      //for (var i= 0; i<component.components.length; i++) {
      //  expect(element.node.props.children[1].props.children[0].props.children[0][i].props.children.props.component.type).to.equal(component.components[i].type);
      //}
      done();

    });

/*TODO:- Need to write the test case for add another and remove component scenario. Currently test gets fail on both add and remove component scenario,
 because we shallow the child component and try to call the parent method.*/
  });

});
