import EventEmitter from 'eventemitter2';
import React from 'react';
import sinon from 'sinon';
import {expect} from 'chai';
import Form from '../src/components/Form';
import {
  textField,
  visible,
  layout,
  columns
} from './fixtures';

import {
  createIfExceed,
  createMount,
  seq
} from './utils';

describe('Form component', function() {
  let mount;
  let options;

  beforeEach(() => {
    options = {
      events: new EventEmitter({
        wildcard: false,
        maxListeners: 0
      })
    };
    mount = createMount();
  });

  afterEach(() => {
    options.events.removeAllListeners();
    mount.cleanUp();
  });

  it('should create formio instance.', function() {
    const element = mount(
      <Form
        form={{display: 'form', components: [textField]}}
        options={options}
      />);
    return element
      .instance()
      .createPromise
      .then(formio => {
        expect(formio).to.be.an('object');
        expect(formio.isBuilt).to.be.true;
      });
  });

  it('should trigger change on form change.', function() {
    const {ifexceed, notify} = createIfExceed();
    const onchange = sinon.spy(notify);
    let root;
    let input;
    let element;
    return seq([
      () => {
        element = mount(
          <Form
            form={{display: 'form', components: [textField]}}
            onChange={onchange}
            options={options}
          />
        );
        return ifexceed('initial change is not triggered', () => {
          expect(onchange.calledOnce).to.be.true;
          // throw new Error;
        });
      },
      () => {
        root = element.getDOMNode();
        input = root.querySelector('input[type="text"]');
        input.value = 'text';
        input.dispatchEvent(new Event('input'));
        return ifexceed('textField change is not triggered', () => {
          expect(onchange.calledTwice).to.be.true;
        });
      },
      () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        return ifexceed('textField change is not triggered', () => {
          expect(onchange.calledThrice).to.be.true;
        });
      }
    ]);
  });

  it('should trigger change when field is visible.', function() {
    const {ifexceed, notify} = createIfExceed();
    const onchange = sinon.spy(notify);
    let root;
    let input;
    let checkbox;
    let element;
    return seq([
      () => {
        element = mount(
          <Form
            form={{display: 'form', components: visible}}
            onChange={onchange}
          />
        );
        return ifexceed('not initialised', () => {
          expect(onchange.calledOnce).to.be.true;
        });
      },
      () => {
        root = element.getDOMNode();
        checkbox = root.querySelector('input[type="checkbox"]');
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('not trigger on checkbox change', () => {
          expect(onchange.callCount).to.equal(2);
        });
      },
      () => {
        input = root.querySelector('input[type="text"]');
        input.value = 'text';
        input.dispatchEvent(new Event('input'));
        return ifexceed('input change fail', () => {
          expect(onchange.callCount).to.equal(3);
        });
      },
      () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        return ifexceed('input change fail', () => {
          expect(onchange.callCount).to.equal(4);
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('checkbox click fail', () => {
          expect(onchange.callCount).to.equal(5);
        });
      }
    ]);
  });

  it('should trigger change and remove hidden data on form load.', function() {
    const {ifexceed, notify} = createIfExceed();
    const onchange = sinon.spy(notify);
    let root;
    let input;
    let checkbox;
    let element;
    let formio;

    return seq([
      () => {
        element = mount(
          <Form
            form={{display: 'form', components: visible}}
            onChange={onchange}
            submission={{data: {visible: false, textfield: 'Test'}}}
          />
        );
        return ifexceed('fail on init change', () => {
          formio = element.instance().formio;
          root = element.getDOMNode();
          expect(onchange.calledOnce).to.be.true;
          expect(formio.submission).to.have.deep.property('data', {visible: false});
        });
      },
      () => {
        checkbox = root.querySelector('input[type="checkbox"]');
        input = root.querySelector('input[type="text"]');
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.calledTwice).to.be.true;
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: ''}});
        });
      },
      () => {
        input.value = 'value';
        input.dispatchEvent(new Event('input'));
        return ifexceed('fail on textfield input', () => {
          expect(onchange.callCount).to.equal(3);
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: 'value'}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox hide', () => {
          expect(onchange.callCount).to.equal(4);
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      }
    ]);
  });

  it('should trigger change when data exists.', function() {
    const {ifexceed, notify} = createIfExceed();
    const onchange = sinon.spy(notify);
    let root;
    let input;
    let checkbox;
    let element;
    let formio;
    return seq([
      () => {
        element = mount(
          <Form
            form={{display: 'form', components: visible}}
            onChange={onchange}
            submission={{data: {visible: true, textfield: 'Test'}}}
          />
        );
        return ifexceed('fail on init change', () => {
          formio = element.instance().formio;
          root = element.getDOMNode();
          checkbox = root.querySelector('input[type="checkbox"]');
          input = root.querySelector('input[type="text"]');
          expect(onchange.calledOnce).to.be.true;
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: 'Test'}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.calledTwice).to.be.true;
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(3);
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: ''}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(4);
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      }
    ]);
  });

  it('should trigger change when data is hidden in a layout component.', function() {
    const {ifexceed, notify} = createIfExceed();
    const onchange = sinon.spy(notify);
    let root;
    let input;
    let checkbox;
    let element;
    let formio;
    return seq([
      () => {
        element = mount(
          <Form
            form={{display: 'form', components: layout}}
            onChange={onchange}
            submission={{data: {visible: false, textfield: 'Test'}}}
          />
        );
        return ifexceed('fail on init change', () => {
          formio = element.instance().formio;
          root = element.getDOMNode();
          checkbox = root.querySelector('input[type="checkbox"]');
          input = root.querySelector('input[type="text"]');
          expect(onchange.calledOnce).to.be.true;
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.calledTwice).to.be.true;
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: ''}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(3);
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        input.value = 'value';
        input.dispatchEvent(new Event('input'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(4);
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: 'value'}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(5);
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      },
    ]);
  });

  it('should trigger change when dat is hindden in a columns component.', function() {
    const {ifexceed, notify} = createIfExceed();
    const onchange = sinon.spy(notify);
    let root;
    let input;
    let checkbox;
    let element;
    let formio;
    return seq([
      () => {
        element = mount(
          <Form
            form={{display: 'form', components: columns}}
            onChange={onchange}
            submission={{data: {visible: false, textfield: 'Test'}}}
          />
        );
        return ifexceed('fail on init change', () => {
          formio = element.instance().formio;
          root = element.getDOMNode();
          checkbox = root.querySelector('input[type="checkbox"]');
          input = root.querySelector('input[type="text"]');
          expect(onchange.calledOnce).to.be.true;
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.calledTwice).to.be.true;
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: ''}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(3);
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        input.value = 'value';
        input.dispatchEvent(new Event('input'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(4);
          expect(formio.submission).to.deep.equal({data: {visible: true, textfield: 'value'}});
        });
      },
      () => {
        checkbox.dispatchEvent(new MouseEvent('click'));
        return ifexceed('fail on checkbox click', () => {
          expect(onchange.callCount).to.equal(5);
          expect(formio.submission).to.deep.equal({data: {visible: false}});
        });
      },
    ]);
  });
});
