'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var components = {};
var groups = {
  __component: {
    title: 'Basic Components'
  },
  advanced: {
    title: 'Special Components'
  },
  layout: {
    title: 'Layout Components'
  }
};

var FormioComponents = exports.FormioComponents = {
  addGroup: function addGroup(name, group) {
    groups[name] = group;
  },
  register: function register(type, component, group) {
    if (!components[type]) {
      components[type] = component;
    } else {
      Object.assign(components[type], component);
    }

    // Set the type for this component.
    if (!components[type].group) {
      components[type].group = group || '__component';
    }
  },
  getComponent: function getComponent(type) {
    return components.hasOwnProperty(type) ? components[type] : components['custom'];
  },
  components: components,
  groups: groups
};