import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Survey from './survey.jsx';
import sinon from 'sinon';

import form from '../../../test/forms/empty.json';

describe('Survey', function () {
  describe('Survey field', function () {
    var component= {
      "inline": false,
      "conditional": {
        "eq": "",
        "when": null,
        "show": ""
      },
      "type": "survey",
      "validate": {
        "customPrivate": false,
        "custom": "",
        "required": false
      },
      "persistent": true,
      "protected": false,
      "defaultValue": "",
      "values": [
        {
          "label": "firsrtCol",
          "value": "firsrtCol"
        },
        {
          "label": "secCol",
          "value": "secCol"
        }
      ],
      "questions": [
        {
          "label": "first",
          "value": "first"
        },
        {
          "label": "second",
          "value": "second"
        }
      ],
      "key": "testSurvey",
      "label": "Test Survey",
      "tableView": true,
      "input": true
    };
    var attachToForm = sinon.spy();

    it('Renders a Survey field', function (done) {
      const element = render(
        <Survey
      component={component}
      attachToForm={attachToForm}
        ></Survey>
      ).children().eq(0);
      expect(element).to.have.length(1);
      expect(element.hasClass('form-group form-field-type-survey form-group-testSurvey')).to.equal(true);
      expect(element.attr('id')).to.equal('form-group-testSurvey');
      expect(element.find('.table').length).to.equal(1);
      expect(element.find('.table').hasClass('table table-striped table-bordered')).to.equal(true);
      done();
    });

    it('Check the numbner of rows of survey component', function(done) {
      const element = render(
        <Survey
      component={component}
      attachToForm={attachToForm}
        ></Survey>
      ).find('.table');
      expect(element).to.have.length(1);
      expect(element.hasClass('table table-striped table-bordered')).to.equal(true);
      expect(element.find('tbody').length).to.equal(1);

      // Added the 1 to the component.questions to take a count of the first row
      expect(element.find('tbody tr').length).to.equal(component.questions.length + 1);
      done();
    });

    it('Check the numbner of columns of survey component', function(done) {
      const element = render(
        <Survey
      component={component}
      attachToForm={attachToForm}
        ></Survey>
      ).find('.table');
      expect(element).to.have.length(1);
      expect(element.hasClass('table table-striped table-bordered')).to.equal(true);
      expect(element.find('tbody').length).to.equal(1);

      // Added 1 to component.values to take a count of first column.

      //  As any class is not assigned for tr so unable to separate out the td's.
      // TODO:- Need to do it in better way. By settingup the className for tr.

      expect(element.find('tbody tr td').length).to.equal((component.values.length + 1) * (component.values.length + 1));
      done();
    });

    it('Check the number of question labels for survey component', function(done) {
      const element = render(
        <Survey
      component={component}
      attachToForm={attachToForm}
        ></Survey>
      ).find('.table');
      expect(element).to.have.length(1);

      expect(element.find('tbody tr td label').length).to.equal(component.questions.length);
      done();
    });

    it('Check the number of anwser radio inputs for survey component', function(done) {
      const element = render(
        <Survey
      component={component}
      attachToForm={attachToForm}
        ></Survey>
      ).find('.table');
      expect(element).to.have.length(1);

      //  As any class is not assigned for tr so unable to separate out the td's.
      // TODO:- Need to do it in better way. By settingup the className for tr.

      expect(element.find('tbody tr td input').length).to.equal(component.questions.length * component.questions.length);

      done();
    });

    it('sets a custom class', function(done) {
      component.customClass = 'my-custom-class'
      const element = render(
        <Survey
          component={component}
          attachToForm={attachToForm}
        ></Survey>
      ).children().eq(0);
      expect(element.attr('class').split(' ')).to.contain('my-custom-class');
      done();
    });

  });

});
