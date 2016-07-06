'use strict';

// Is this the best way to create a registry? We don't have providers like Angular.
window.FormioComponents = {};
FormioComponents.address = require('./address');
FormioComponents.button = require('./button');
FormioComponents.checkbox = require('./checkbox');
FormioComponents.columns = require('./columns');
FormioComponents.container = require('./container');
FormioComponents.content = require('./content');
FormioComponents.currency = require('./currency');
FormioComponents.custom = require('./custom');
FormioComponents.datagrid = require('./datagrid');
FormioComponents.datetime = require('./datetime');
FormioComponents.email = require('./email');
FormioComponents.fieldset = require('./fieldset');
FormioComponents.hidden = require('./hidden');
FormioComponents.htmlelement = require('./htmlelement');
FormioComponents.number = require('./number');
FormioComponents.panel = require('./panel');
FormioComponents.password = require('./password');
FormioComponents.phoneNumber = require('./phoneNumber');
FormioComponents.radio = require('./radio');
FormioComponents.resource = require('./resource');
FormioComponents.survey = require('./survey');
FormioComponents.select = require('./select');
FormioComponents.selectboxes = require('./selectboxes');
FormioComponents.signature = require('./signature');
FormioComponents.table = require('./table');
FormioComponents.textarea = require('./textarea');
FormioComponents.textfield = require('./textfield');
FormioComponents.well = require('./well');

module.exports = {};