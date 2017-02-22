import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import { Formio } from '../src/components/Formio.jsx';
import sinon from 'sinon';

describe('Validations @validations', function () {
  it('defaults to a valid form', function(done) {
    const element = mount(
      <Formio
        form={{
          components: [
            {
              'input': true,
              'tableView': true,
              'inputType': 'text',
              'inputMask': '',
              'label': 'My Textfield',
              'key': 'myTextfield',
              'placeholder': '',
              'prefix': '',
              'suffix': '',
              'multiple': false,
              'defaultValue': '',
              'protected': false,
              'unique': false,
              'persistent': true,
              'validate': {
                'required': false,
                'minLength': '',
                'maxLength': '',
                'pattern': '',
                'custom': '',
                'customPrivate': false
              },
              'conditional': {
                'show': null,
                'when': null,
                'eq': ''
              },
              'type': 'textfield'
            }
          ]
        }}
      />
    );
    expect(element.state('isValid')).to.equal(true);
    done();
  });

  it('validates on form load', function(done) {
    const element = mount(
      <Formio
        form={{
          components: [
            {
              'input': true,
              'tableView': true,
              'inputType': 'text',
              'inputMask': '',
              'label': 'My Textfield',
              'key': 'myTextfield',
              'placeholder': '',
              'prefix': '',
              'suffix': '',
              'multiple': false,
              'defaultValue': '',
              'protected': false,
              'unique': false,
              'persistent': true,
              'validate': {
                'required': true,
                'minLength': '',
                'maxLength': '',
                'pattern': '',
                'custom': '',
                'customPrivate': false
              },
              'conditional': {
                'show': null,
                'when': null,
                'eq': ''
              },
              'type': 'textfield'
            }
          ]
        }}
      />
    );
    expect(element.state('isValid')).to.equal(false);
    done();
  });

  it('validates when field becomes valid', function(done) {
    const element = mount(
      <Formio
        form={{
          components: [
            {
              'input': true,
              'tableView': true,
              'inputType': 'text',
              'inputMask': '',
              'label': 'My Textfield',
              'key': 'myTextfield',
              'placeholder': '',
              'prefix': '',
              'suffix': '',
              'multiple': false,
              'defaultValue': '',
              'protected': false,
              'unique': false,
              'persistent': true,
              'validate': {
                'required': true,
                'minLength': '',
                'maxLength': '',
                'pattern': '',
                'custom': '',
                'customPrivate': false
              },
              'conditional': {
                'show': null,
                'when': null,
                'eq': ''
              },
              'type': 'textfield'
            }
          ]
        }}
      />
    );
    element.find('input').simulate('change', {target: {value: 'My Value'}});
    expect(element.state('isValid')).to.equal(true);
    done();
  });

  it('validates when required field becomes cleared', function(done) {
    const element = mount(
      <Formio
        form={{
          components: [
            {
              'input': true,
              'tableView': true,
              'inputType': 'text',
              'inputMask': '',
              'label': 'My Textfield',
              'key': 'myTextfield',
              'placeholder': '',
              'prefix': '',
              'suffix': '',
              'multiple': false,
              'defaultValue': '',
              'protected': false,
              'unique': false,
              'persistent': true,
              'validate': {
                'required': true,
                'minLength': '',
                'maxLength': '',
                'pattern': '',
                'custom': '',
                'customPrivate': false
              },
              'conditional': {
                'show': null,
                'when': null,
                'eq': ''
              },
              'type': 'textfield'
            }
          ]
        }}
      />
    );
    element.find('input').simulate('change', {target: {value: 'My Value'}});
    expect(element.state('isValid')).to.equal(true);
    element.find('input').simulate('change', {target: {value: ''}});
    expect(element.state('isValid')).to.equal(false);
    done();
  });

  it('validates when required field is hidden', function(done) {
    const element = mount(
      <Formio
        form={{
          "components": [
            {
              "input": true,
              "inputType": "checkbox",
              "tableView": true,
              "hideLabel": true,
              "label": "Visible",
              "datagridLabel": true,
              "key": "visible",
              "defaultValue": false,
              "protected": false,
              "persistent": true,
              "clearOnHide": true,
              "validate": {
                "required": false
              },
              "type": "checkbox",
              "tags": [],
              "conditional": {
                "show": "",
                "when": null,
                "eq": ""
              }
            },
            {
              "input": true,
              "tableView": true,
              "inputType": "text",
              "inputMask": "",
              "label": "Textfield",
              "key": "textfield",
              "placeholder": "",
              "prefix": "",
              "suffix": "",
              "multiple": false,
              "defaultValue": "",
              "protected": false,
              "unique": false,
              "persistent": true,
              "clearOnHide": true,
              "validate": {
                "required": true,
                "minLength": "",
                "maxLength": "",
                "pattern": "",
                "custom": "",
                "customPrivate": false
              },
              "conditional": {
                "show": "true",
                "when": "visible",
                "eq": "true"
              },
              "type": "textfield",
              "tags": []
            }
          ]
        }}
      />
    );
    expect(element.state('isValid')).to.equal(true);
    const checkbox = element.find('input[type="checkbox"]');
    checkbox.simulate('change', {target: {"checked": true}});
    expect(element.state('isValid')).to.equal(false);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(element.state('isValid')).to.equal(true);
    done();
  });

  it('validates when inside a container', function(done) {
    const element = mount(
      <Formio
        form={{
          "components": [
            {
              "conditional": {
                "eq": "",
                "when": null,
                "show": ""
              },
              "tags": [],
              "type": "container",
              "clearOnHide": true,
              "persistent": true,
              "protected": false,
              "key": "container1",
              "label": "Container",
              "tableView": true,
              "components": [
                {
                  "isNew": false,
                  "tags": [],
                  "type": "textfield",
                  "validate": {
                    "customPrivate": false,
                    "custom": "",
                    "pattern": "",
                    "maxLength": "",
                    "minLength": "",
                    "required": true
                  },
                  "clearOnHide": true,
                  "persistent": true,
                  "unique": false,
                  "protected": false,
                  "defaultValue": "",
                  "multiple": false,
                  "suffix": "",
                  "prefix": "",
                  "placeholder": "",
                  "key": "textfield",
                  "label": "Textfield",
                  "inputMask": "",
                  "inputType": "text",
                  "tableView": true,
                  "input": true
                }
              ],
              "tree": true,
              "input": true
            }
          ]
        }}
      />
    );
    expect(element.state('isValid')).to.equal(false);
    element.find('input').simulate('change', {target: {value: 'My Value'}});
    expect(element.state('isValid')).to.equal(true);
    done();
  });

  it('validates when inside a hidden container', function(done) {
    const element = mount(
      <Formio
        form={{
          components: [
            {
              "conditional": {
                "eq": "",
                "when": null,
                "show": ""
              },
              "tags": [],
              "type": "checkbox",
              "validate": {
                "required": false
              },
              "clearOnHide": true,
              "persistent": true,
              "protected": false,
              "defaultValue": false,
              "key": "visible",
              "datagridLabel": true,
              "label": "Visible",
              "hideLabel": true,
              "tableView": true,
              "inputType": "checkbox",
              "input": true
            },
            {
              "conditional": {
                "eq": "true",
                "when": "visible",
                "show": "true"
              },
              "tags": [],
              "type": "container",
              "clearOnHide": true,
              "persistent": true,
              "protected": false,
              "key": "container1",
              "label": "Container",
              "tableView": true,
              "components": [
                {
                  "tags": [],
                  "type": "textfield",
                  "conditional": {
                    "eq": "",
                    "when": "",
                    "show": ""
                  },
                  "validate": {
                    "customPrivate": false,
                    "custom": "",
                    "pattern": "",
                    "maxLength": "",
                    "minLength": "",
                    "required": true
                  },
                  "clearOnHide": true,
                  "persistent": true,
                  "unique": false,
                  "protected": false,
                  "defaultValue": "",
                  "multiple": false,
                  "suffix": "",
                  "prefix": "",
                  "placeholder": "",
                  "key": "textfield",
                  "label": "Textfield",
                  "inputMask": "",
                  "inputType": "text",
                  "tableView": true,
                  "input": true
                }
              ],
              "tree": true,
              "input": true
            }
          ]
        }}
      />
    );
    const checkbox = element.find('input[type="checkbox"]');
    expect(element.state('isValid')).to.equal(true);
    checkbox.simulate('change', {target: {"checked": true}});
    expect(element.state('isValid')).to.equal(false);
    const textfield = element.find('input[type="text"]');
    textfield.simulate('change', {target: {value: 'My Value'}});
    expect(element.state('isValid')).to.equal(true);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(element.state('isValid')).to.equal(true);
    done();
  });

  it('validates a required field in a datagrid', function(done) {
    const element = mount(
      <Formio
        form={{
          components: [
            {
              "conditional": {
                "eq": "",
                "when": null,
                "show": ""
              },
              "tags": [],
              "type": "datagrid",
              "clearOnHide": true,
              "persistent": true,
              "protected": false,
              "key": "datagrid1",
              "label": "",
              "tableView": true,
              "components": [
                {
                  "hideLabel": true,
                  "isNew": false,
                  "tags": [],
                  "type": "textfield",
                  "conditional": {
                    "eq": "",
                    "when": "",
                    "show": ""
                  },
                  "validate": {
                    "customPrivate": false,
                    "custom": "",
                    "pattern": "",
                    "maxLength": "",
                    "minLength": "",
                    "required": true
                  },
                  "clearOnHide": true,
                  "persistent": true,
                  "unique": false,
                  "protected": false,
                  "defaultValue": "",
                  "multiple": false,
                  "suffix": "",
                  "prefix": "",
                  "placeholder": "",
                  "key": "textfield",
                  "label": "Textfield",
                  "inputMask": "",
                  "inputType": "text",
                  "tableView": true,
                  "input": true
                }
              ],
              "tree": true,
              "input": true
            }
          ]
        }}
      />
    );
    expect(element.state('isValid')).to.equal(false);
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    expect(element.state('isValid')).to.equal(true);
    element.find('input[type="text"]').simulate('change', {target: {value: ''}});
    expect(element.state('isValid')).to.equal(false);
    element.find('.datagrid-table .btn').simulate('click');
    expect(element.state('isValid')).to.equal(true);
    done();
  });

  it('validates a required field in a hidden datagrid', function(done) {
    const element = mount(
      <Formio
        form={{
          components: [
            {
              "isNew": false,
              "conditional": {
                "eq": "",
                "when": null,
                "show": ""
              },
              "tags": [],
              "type": "checkbox",
              "validate": {
                "required": false
              },
              "clearOnHide": true,
              "persistent": true,
              "protected": false,
              "defaultValue": false,
              "key": "checkbox",
              "datagridLabel": true,
              "label": "Checkbox",
              "hideLabel": true,
              "tableView": true,
              "inputType": "checkbox",
              "input": true
            },
            {
              "input": true,
              "tree": true,
              "components": [
                {
                  "input": true,
                  "tableView": true,
                  "inputType": "text",
                  "inputMask": "",
                  "label": "Textfield",
                  "key": "textfield",
                  "placeholder": "",
                  "prefix": "",
                  "suffix": "",
                  "multiple": false,
                  "defaultValue": "",
                  "protected": false,
                  "unique": false,
                  "persistent": true,
                  "clearOnHide": true,
                  "validate": {
                    "required": true,
                    "minLength": "",
                    "maxLength": "",
                    "pattern": "",
                    "custom": "",
                    "customPrivate": false
                  },
                  "conditional": {
                    "show": "",
                    "when": "",
                    "eq": ""
                  },
                  "type": "textfield",
                  "tags": [],
                  "isNew": false,
                  "hideLabel": true
                }
              ],
              "tableView": true,
              "label": "",
              "key": "datagrid1",
              "protected": false,
              "persistent": true,
              "clearOnHide": true,
              "type": "datagrid",
              "tags": [],
              "conditional": {
                "show": "true",
                "when": "checkbox",
                "eq": "true"
              }
            }
          ]
        }}
      />
    );
    const checkbox = element.find('input[type="checkbox"]');
    expect(element.state('isValid')).to.equal(true);
    checkbox.simulate('change', {target: {"checked": true}});
    expect(element.state('isValid')).to.equal(false);
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    expect(element.state('isValid')).to.equal(true);
    element.find('input[type="text"]').simulate('change', {target: {value: ''}});
    expect(element.state('isValid')).to.equal(false);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(element.state('isValid')).to.equal(true);
    done();
  });

});