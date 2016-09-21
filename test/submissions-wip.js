import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Formio from '../src/Formio';
import sinon from 'sinon';
import {fetch, Headers} from 'whatwg-fetch';
global.window.Headers = Headers;
//global.window.fetch = fetch;

describe('Submission tests @submission', function () {
  before(function(done) {
    var form = {
      "title": "My Form",
      "display": "form",
      "type": "form",
      "name": "myform",
      "path": "myform",
      "components": [
        {
          "input": true,
          "tableView": true,
          "inputType": "text",
          "inputMask": "",
          "label": "Name",
          "key": "name",
          "placeholder": "",
          "prefix": "",
          "suffix": "",
          "multiple": false,
          "defaultValue": "",
          "protected": false,
          "unique": false,
          "persistent": true,
          "validate": {
            "required": false,
            "minLength": "",
            "maxLength": "",
            "pattern": "",
            "custom": "",
            "customPrivate": false
          },
          "type": "textfield"
        },
        {
          "input": true,
          "tableView": true,
          "label": "Message",
          "key": "message",
          "placeholder": "",
          "prefix": "",
          "suffix": "",
          "rows": 3,
          "multiple": false,
          "defaultValue": "",
          "protected": false,
          "persistent": true,
          "validate": {
            "required": false,
            "minLength": "",
            "maxLength": "",
            "pattern": "",
            "custom": ""
          },
          "type": "textarea"
        },
        {
          "input": true,
          "label": "Submit",
          "tableView": false,
          "key": "submit",
          "size": "md",
          "leftIcon": "",
          "rightIcon": "",
          "block": false,
          "action": "submit",
          "disableOnInvalid": true,
          "theme": "primary",
          "type": "button"
        }
      ]
    };

    sinon.stub(window, 'fetch')
      .withArgs('https://myproject.form.io/myform', sinon.match.any).yields(null, {statusCode: 200, headers: {}}, Promise.resolve(form));

    done();
  });

  it('Submits the form to form.io', function(done) {
    var onFormLoad = function(form) {
      console.log(element.html());
      done();
    }
    const element = mount(
      <Formio
        src='https://myproject.form.io/myform'
        onFormLoad={onFormLoad}
      ></Formio>
    );
  });

  after(function(done) {
    window.fetch.restore();
    done();
  });
});