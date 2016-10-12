import React from 'react';
import { FormioComponents } from '../factories';

export default class extends React.Component {
  render = () => {
    return (
      <div className="formio-components">
        {
          this.props.components.map(function(component, index) {
            var key = component.key || component.type + index;
            var value = (this.props.values && this.props.values.hasOwnProperty(component.key) ? this.props.values[component.key] : null);
            var FormioElement = FormioComponents.getComponent(component.type);
            if (this.props.checkConditional(component)) {
              return (
                <FormioElement
                  {...this.props}
                  name={component.key}
                  key={key}
                  component={component}
                  value={value}
                />
              );
            }
            else {
              return null;
            }
          }.bind(this))
        }
      </div>
    );
  }
}
