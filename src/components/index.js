'use strict'

// Is this the best way to create a registry? We don't have providers like Angular.
window.FormioComponents = {};
FormioComponents.address = require('./address');
FormioComponents.button = require('./button');
FormioComponents.phoneNumber = require('./phoneNumber');
FormioComponents.select = require('./select');
FormioComponents.textarea = require('./textarea');
FormioComponents.textfield = require('./textfield');

module.exports = {};