import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Number from '../src/components/number.jsx';
import sinon from 'sinon';

import form from './forms/empty.json';

describe('Number', function(){
    describe('Number field', function(){
        var component = {
            'input': true,
            'tableView': false,
            'inputType': 'text',
            'label': 'Number',
            'key': 'number',
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
            'type': 'number'
        };

        var attachToForm = sinon.spy();
        it('Renders a number field', function(done){
            const element = render (
                <Number
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).children().eq(0);
            expect(element).to.have.length(1);
            expect(element.hasClass('form-group form-field-type-number form-group-number')).to.equal(true);
            expect(element.attr('id')).to.equal('form-group-number');
            expect(element.find('.formio-component-single').length).to.equal(1);
            expect(element.find('.formio-component-single label').length).to.equal(1);
            expect(element.find('.formio-component-single label').html()).to.equal('Number');
            expect(element.find('.formio-component-single label').attr('for')).to.equal('number');
            expect(element.find('.formio-component-single .input-group').length).to.equal(1);
            expect(element.find('.formio-component-single .input-group input').length).to.equal(1);
            expect(element.find('.formio-component-single .input-group input').attr('type')).to.equal('text');
            expect(element.find('.formio-component-single .input-group input').attr('class')).to.equal('form-control');
            expect(element.find('.formio-component-single .input-group input').attr('id')).to.equal('number');
            expect(element.find('.formio-component-single .input-group input').attr('data-index')).to.equal('0');
            expect(element.find('.formio-component-single .input-group input').attr('value')).to.equal('0');
            expect(element.find('.formio-component-single .input-group input').attr('placeholder')).to.equal('');
            done();
        });

        it('Updates the placeholder value', function(done){
            component.placeholder = 'My Placeholder';
            const element = render (
                <Number
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('input#number');
            expect(element.attr('placeholder')).to.equal('My Placeholder');
            component.placeholder = '';
            done();
        });

        it('Renders with a prefix', function(done){
            component.prefix = '$';
            const element = render (
                <Number
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('.input-group');
            expect(element.children().length).to.equal(2);
            expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(0).html()).to.equal('$');
            component.prefix = '';
            done();
        });

        it('Renders with a suffix', function(done){
            component.suffix = 'Pounds';
            const element = render (
                <Number
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('.input-group');
            expect(element.children().length).to.equal(2);
            expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(1).html()).to.equal('Pounds');
            component.suffix = '';
            done();
        });

        it('Renders with prefix and suffix', function(done){
            component.prefix = 'Prefix';
            component.suffix = 'Suffix';
            const element = render (
                <Number
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('.input-group');
            expect(element.children().length).to.equal(3);
            expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(0).html()).to.equal('Prefix');
            expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(2).html()).to.equal('Suffix');
            component.prefix = '';
            component.suffix = '';
            done();
        });

        it('Sets a default value', function(done){
            const element = render (
                <Number
                name="number"
                value="My Value"
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('input');
            expect(element.attr('value')).to.equal('My Value');
            done();
        });
    });

    describe('Multiple Number Field', function(){
        var component = {
            'input': true,
            'tableView': true,
            'inputType': 'text',
            'inputMask': '',
            'label': 'My Numberfield',
            'key': 'number',
            'placeholder': '',
            'prefix': '',
            'suffix': '',
            'multiple': true,
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
            'type': 'number'
        };

        var attachToForm = sinon.spy();
        it('Renders a multivalue number field', function(done){
            const element = render (
                <Number
                    name="number"
                    component={component}
                    attachToForm={attachToForm}
                ></Number>
            ).find('.form-field-type-number');
            expect(element).to.have.length(1);
            expect(element.hasClass('form-group form-field-type-number form-group-number')).to.equal(true);
            expect(element.attr('id')).to.equal('form-group-number');
            expect(element.children().eq(0).hasClass('formio-component-multiple')).to.equal(true);
            expect(element.children().eq(0).children().eq(0).attr('for')).to.equal('number');
            expect(element.children().eq(0).children().eq(0).hasClass('control-label')).to.equal(true);
            expect(element.children().eq(0).children().eq(0).text()).to.equal('My Numberfield');
            const table = element.children().eq(0).children().eq(1);
            expect(table.hasClass('table table-bordered')).to.equal(true);
            expect(table.find('tr').length).to.equal(2);
            expect(table.find('tr td div.input-group').length).to.equal(1);
            expect(table.find('tr td div.input-group input').attr('type')).to.equal('text');
            expect(table.find('tr td div.input-group input').attr('placeholder')).to.equal('');
            expect(table.find('tr td div.input-group input').attr('value')).to.equal('0');
            expect(table.find('tr td div.input-group input').attr('id')).to.equal('number');
            expect(table.find('tr td div.input-group input').attr('name')).to.equal('number');
            expect(table.find('tr td div.input-group input').attr('class')).to.equal('form-control');
            expect(table.find('tr td div.input-group input').attr('data-index')).to.equal('0');
            done();
        });

        it('Fills in the placeholder value', function(done){
            component.placeholder = "My Placeholder";
            const element = render (
                <Number
                name="number"
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('input#number');
            expect(element.attr('placeholder')).to.equal('My Placeholder');
            component.placeholder = '';
            done();
        });

        it('Renders with a prefix', function(done){
            component.prefix = '$';
            const element = render (
                <Number
                name="number"
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('.input-group');
            expect(element.children().length).to.equal(2);
            expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(0).html()).to.equal('$');
            component.prefix = '';
            done();
        });

        it('Renders with a suffix', function(done){
            component.suffix = 'Pounds';
            const element = render (
                <Number
                name="number"
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('.input-group');
            expect(element.children().length).to.equal(2);
            expect(element.children().eq(1).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(1).html()).to.equal('Pounds');
            component.suffix = '';
            done();
        });

        it('Renders with prefix and suffix', function(done){
            component.prefix = "Prefix";
            component.suffix = "Suffix";
            const element = render (
                <Number
                name="number"
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('.input-group');
            expect(element.children().length).to.equal(3);
            expect(element.children().eq(0).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(0).html()).to.equal('Prefix');
            expect(element.children().eq(2).hasClass('input-group-addon')).to.equal(true);
            expect(element.children().eq(2).html()).to.equal('Suffix');
            component.prefix = '';
            component.suffix = '';
            done();
        });

        it('Sets a default value', function(done){
            const element = render (
                <Number
                name="number"
                value="My Value"
                component={component}
                attachToForm={attachToForm}
                ></Number>
            ).find('input');
            expect(element.attr('value')).to.equal('My Value');
            done();
        });

        it('Adds and removes rows', function(done) {
          component.defaultValue = 'My Value';
          const element = mount(
            <Number
              name="number"
              component={component}
              attachToForm={attachToForm}
            ></Number>
        ).find('.form-field-type-number');
          const table = element.find('table');
          table.find('a.btn.add-row').simulate('click');
          expect(table.find('tr').length).to.equal(3);
          expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
          expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
          table.find('a.btn.add-row').simulate('click');
          expect(table.find('tr').length).to.equal(4);
          expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
          expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
          expect(table.find('tr').at(2).find('input').prop('data-index')).to.equal(2);
          table.find('a.btn.add-row').simulate('click');
          expect(table.find('tr').length).to.equal(5);
          expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
          expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
          expect(table.find('tr').at(2).find('input').prop('data-index')).to.equal(2);
          expect(table.find('tr').at(3).find('input').prop('data-index')).to.equal(3);
          table.find('a.btn.remove-row-3').simulate('click');
          expect(table.find('tr').length).to.equal(4);
          expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
          expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
          expect(table.find('tr').at(2).find('input').prop('data-index')).to.equal(2);
          table.find('a.btn.remove-row-1').simulate('click');
          expect(table.find('tr').length).to.equal(3);
          expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
          expect(table.find('tr').at(1).find('input').prop('data-index')).to.equal(1);
          table.find('a.btn.remove-row-1').simulate('click');
          expect(table.find('tr').length).to.equal(2);
          expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
          table.find('a.btn.remove-row-0').simulate('click');
          expect(table.find('tr').length).to.equal(1);
          table.find('a.btn.add-row').simulate('click');
          expect(table.find('tr').length).to.equal(2);
          expect(table.find('tr').at(0).find('input').prop('data-index')).to.equal(0);
          done();
      });
    });
});
