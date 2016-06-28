import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(mount(<div className="foo" />).find('.foo').length).to.equal(1);
  });
});
