
//Spec for textfeild component
export var textfeild = {
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
  },
//Spec for password component
  password= {
    'input': true,
    'tableView': false,
    'inputType': 'password',
    'label': 'Password',
    'key': 'password',
    'placeholder': '',
    'prefix': '',
    'suffix': '',
    'protected': true,
    "persistent": true,
    'inputMask': '',
    'multiple': false,
    'defaultValue': '',
    'unique': false,
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
    'type': 'password'
  },
//Spec for phoneNumber component
  phoneNumber= {
    "conditional": {
      "eq": "",
      "when": null,
      "show": ""
    },
    "type": "phoneNumber",
    "validate": {
      "required": false
    },
    "defaultValue": "",
    "persistent": true,
    "unique": false,
    "protected": false,
    "multiple": false,
    "suffix": "",
    "prefix": "",
    "placeholder": "",
    "key": "phoneNumber",
    "label": "Phone Number",
    "inputMask": "(999) 999-9999",
    "tableView": true,
    "input": true
  };
