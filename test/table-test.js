import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Table from '../src/components/table.jsx';
import sinon from 'sinon';
import form from './forms/empty.json';

var components = require('./forms/componentSpec.js');

describe('Table', function () {
  describe(' Table component', function () {
    var component= {
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "table",
      "condensed": false,
      "hover": false,
      "bordered": false,
      "striped": false,
      "caption": "",
      "header": [],
      "rows": [
        [
          {
            "components": [
              components.textfeild
            ]
          },
          {
            "components": [
              components.password
            ]
          }
        ],
        [
          {
            "components": [
              components.phoneNumber
            ]
          },
          {
            "components": [
              components.textfeild
            ]
          }
        ]
      ],
      "numCols": 2,
      "numRows": 2,
      "input": false
    };
    var attachToForm = sinon.spy();

    it('Renders a basic Table', function (done) {
      const element = shallow(<Table
      component={component}
      attachToForm={attachToForm}
      {...this.props} />)
      expect(element.find('.table').length).to.equal(1);
      expect(element.find('.table thead').length).to.equal(1);
      expect(element.find('.table tbody').length).to.equal(1);
      done();
    });

    it('Check the table classes ', function (done) {
      component.condensed = true;
      component.hover = true;
      component.bordered = true;
      component.striped = true;

      const element = shallow(<Table
      component={component}
      attachToForm={attachToForm}
      {...this.props} />).find('table');
      expect(element.hasClass('table table-striped table-bordered table-hover table-condensed')).to.equal(true);
      done();
    });

    it('Check the number of rows inside table component ', function (done) {
      const element = shallow(<Table
      component={component}
      attachToForm={attachToForm}
      {...this.props} />).find('table');
      expect(element.find('table tbody tr').length).to.equal(component.numRows);
      done();
    });

    it('Check the number of columns inside table component ', function (done) {
      const element = shallow(<Table
      component={component}
      attachToForm={attachToForm}
      {...this.props} />).find('table');
      //  As any class is not assigned for tr so unable to separate out the td's.
      // TODO:- Need to do it in better way. By settingup the className for tr.
      expect(element.find('table tbody tr td').length).to.equal(component.numCols * component.numCols);
      done();
    });

    it('Check the nested components of table', function (done) {
      const element = shallow(<Table
      component={component}
      attachToForm={attachToForm}
      {...this.props} />).find('.table tbody tr td');
      //To test the number of nested components of table.
      expect(element.length).to.equal(component.numCols * component.numRows);
      //To test type of nested components of table
      for (var i= 0; i<component.numRows; i++) {
        for (var j = 0; j < component.numCols; j++) {
          expect(element.nodes[j].props.children.props.component.rows[i][j].components[0].type).to.equal(component.rows[i][j].components[0].type);
        }
      }
      done();
    });

  });

});
