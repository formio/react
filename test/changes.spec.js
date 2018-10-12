import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Form from '../src/components/Form';
import sinon from 'sinon';

/* eslint-disable quotes */
describe('Change Events @change', function () {
  it('fires change events on a form', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
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
        onChange={onChange}
      />
    );
    expect(onChange.callCount).to.equal(1);
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(2);
    element.find('input[type="text"]').simulate('change', {target: {value: ''}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(3);
    done();
  });

  it('fires change events on a form with skipInit', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
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
        onChange={onChange}
        options={{skipInit: true}}
      />
    );
    expect(onChange.callCount).to.equal(0);
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(1);
    element.find('input[type="text"]').simulate('change', {target: {value: ''}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(2);
    done();
  });

  it('fires events when a field becomes visible', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
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
        onChange={onChange}
      />
    );
    expect(onChange.callCount).to.equal(1);
    const checkbox = element.find('input[type="checkbox"]');
    checkbox.simulate('change', {target: {"checked": true}});
    expect(onChange.callCount).to.equal(3);
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(4);
    element.find('input[type="text"]').simulate('change', {target: {value: ''}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(5);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(7);
    done();
  });

  it('fires events when a field becomes visible with skipInit', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
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
        onChange={onChange}
        options={{skipInit: true}}
      />
    );
    expect(onChange.callCount).to.equal(0);
    const checkbox = element.find('input[type="checkbox"]');
    checkbox.simulate('change', {target: {"checked": true}});
    expect(onChange.callCount).to.equal(1);
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(2);
    element.find('input[type="text"]').simulate('change', {target: {value: ''}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(3);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(5);
    done();
  });

  it('fires events and removes hidden data on form load', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
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
        onChange={onChange}
        submission={{data: {visible: false, textfield: 'Test'}}}
      />
    );
    expect(onChange.callCount).to.equal(1);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    const checkbox = element.find('input[type="checkbox"]');
    checkbox.simulate('change', {target: {"checked": true}});
    expect(onChange.callCount).to.equal(3);
    expect(onChange.calledWith({data: {visible: true, textfield: ''}})).to.equal(true);
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(4);
    expect(onChange.calledWith({data: {visible: true, textfield: 'My Value'}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(6);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    done();
  });

  it('fires events when data already exists', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
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
        onChange={onChange}
        submission={{data: {visible: true, textfield: 'Test'}}}
      />
    );
    expect(onChange.callCount).to.equal(0);
    const checkbox = element.find('input[type="checkbox"]');
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(2);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": true}});
    expect(onChange.callCount).to.equal(4);
    expect(onChange.calledWith({data: {visible: true, textfield: ''}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(6);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    done();
  });

  it('fires events when data already exists with skipInit', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
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
        onChange={onChange}
        submission={{data: {visible: true, textfield: 'Test'}}}
        options={{skipInit: true}}
      />
    );
    expect(onChange.callCount).to.equal(0);
    const checkbox = element.find('input[type="checkbox"]');
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(2);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": true}});
    expect(onChange.callCount).to.equal(3);
    expect(onChange.calledWith({data: {visible: true}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(4);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": true}});
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(6);
    expect(onChange.calledWith({data: {visible: true, textfield: 'My Value'}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(8);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    done();
  });

  it('fires events when data is hidden in a layout component', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
        form={{
          "components": [
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
              "input": true,
              "lockKey": true
            },
            {
              "key": "fieldset1",
              "input": false,
              "tableView": true,
              "legend": "fieldset",
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
                    "required": false,
                    "minLength": "",
                    "maxLength": "",
                    "pattern": "",
                    "custom": "",
                    "customPrivate": false
                  },
                  "conditional": {
                    "show": "",
                    "when": null,
                    "eq": ""
                  },
                  "type": "textfield",
                  "tags": []
                }
              ],
              "type": "fieldset",
              "tags": [],
              "conditional": {
                "show": "true",
                "when": "visible",
                "eq": "true"
              }
            }
          ]
        }}
        onChange={onChange}
        submission={{data: {visible: false, textfield: 'Test'}}}
      />
    );
    expect(onChange.callCount).to.equal(1);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    const checkbox = element.find('input[type="checkbox"]');
    checkbox.simulate('change', {target: {"checked": true}});
    expect(onChange.callCount).to.equal(3);
    expect(onChange.calledWith({data: {visible: true, textfield: ''}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(5);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": true}});
    element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    element.find('input[type="text"]').simulate('blur');
    expect(onChange.callCount).to.equal(8);
    expect(onChange.calledWith({data: {visible: true, textfield: 'My Value'}})).to.equal(true);
    checkbox.simulate('change', {target: {"checked": false}});
    expect(onChange.callCount).to.equal(10);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    done();
  });

  it('fires events when data is hidden in a column component @wip', function(done) {
    const onChange = sinon.spy();
    const element = mount(
      <Form
        form={{
          "components": [
            {
              "lockKey": true,
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
              "lockKey": true,
              "conditional": {
                "eq": "true",
                "when": "visible",
                "show": "true"
              },
              "tags": [],
              "type": "columns",
              "columns": [
                {
                  "components": [
                    {
                      "isNew": false,
                      "tags": [],
                      "type": "textfield",
                      "conditional": {
                        "eq": "",
                        "when": null,
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
                  ]
                },
                {
                  "components": []
                }
              ],
              "key": "columns1",
              "input": false
            }
          ]
        }}
        onChange={onChange}
        submission={{data: {visible: false, textfield: 'Test'}}}
      />
    );
    expect(onChange.callCount).to.equal(1);
    expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    const checkbox = element.find('input[type="checkbox"]');
    //checkbox.simulate('change', {target: {"checked": true}});
    //expect(onChange.callCount).to.equal(3);
    //expect(onChange.calledWith({data: {visible: true, textfield: ''}})).to.equal(true);
    //checkbox.simulate('change', {target: {"checked": false}});
    //expect(onChange.callCount).to.equal(5);
    //expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    //checkbox.simulate('change', {target: {"checked": true}});
    //element.find('input[type="text"]').simulate('change', {target: {value: 'My Value'}});
    //expect(onChange.callCount).to.equal(8);
    //expect(onChange.calledWith({data: {visible: true, textfield: 'My Value'}})).to.equal(true);
    //checkbox.simulate('change', {target: {"checked": false}});
    //expect(onChange.callCount).to.equal(10);
    //expect(onChange.calledWith({data: {visible: false}})).to.equal(true);
    done();
  });
});
