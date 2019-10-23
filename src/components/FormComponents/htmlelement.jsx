import React from 'react';
import createReactClass from 'create-react-class';
import componentMixin from './mixins/componentMixin';
import FormioUtils from 'formiojs/utils';

module.exports = createReactClass({
  displayName: 'HtmlElement',
  mixins: [componentMixin],
  render: function (value, index) {
    const { component, data, row } = this.props;
    const attrs = component.attrs.reduce((prev, item) => {
      if (item.attr) {
        prev[item.attr] = item.value;
      }
      return prev;
    }, {});
    return (
      <div className="formio-field-type-htmlelement">
        <component.tag
          className={component.customClass}
          {...attrs}
          dangerouslySetInnerHTML={{__html: FormioUtils.interpolate(component.content, {
              data,
              row,
              component,
            })}}
        >
        </component.tag>
      </div>
    );
  }
});
