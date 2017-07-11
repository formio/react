import React, { Component } from 'react';
import clone from 'lodash/clone';
import isEqual from 'lodash/isEqual';
import valueMixin from 'react-formio/lib/components/FormComponents/mixins/valueMixin';
import FormioComponentsList from '../FormioComponentsList';
import FormioUtils from 'formiojs/utils';

const renderTemplate = (template, data, actions = []) => {
  return class extends Component {
    createMarkup = () => {
      return {
        __html: FormioUtils.interpolate(template, data)
      };
    }
    componentDidMount = () => {
      actions.forEach(action => {
        const elements = this.element.getElementsByClassName(action.class);
        Array.prototype.forEach.call(elements, element => {
          element.addEventListener(action.event, action.action);
        });
      });
    }

    render = () => {
      return <div dangerouslySetInnerHTML={this.createMarkup()} ref={element => this.element = element} />;
    }
  };
};

class EditGridRow extends Component {
  constructor(props) {
    super(props);
    this.data = Object.assign({}, props.data);
    this.refresh = false;
  }

  componentWillReceiveProps = (nextProps) => {
    const { components } = this.props;
    // If one of the fields is set to refresh on a value outside the datagrid, check it as well.
    this.refresh = false;
    FormioUtils.eachComponent(components, (component) => {
      if ('refreshOn' in component && component.refreshOn) {
        const { refreshOn } = component;
        if (refreshOn === 'data') {
          this.refresh = true;
        }
        if ((!this.data.hasOwnProperty(refreshOn) && nextProps.hasOwnProperty(refreshOn)) || this.data[refreshOn] !== nextProps.data[refreshOn]) {
          this.refresh = true;
        }
      }
    });
    this.data = Object.assign({}, nextProps.data);
  };

  shouldComponentUpdate = (nextProps) => {
    const { row, isOpen } = this.props;

    if (!isEqual(row, nextProps.row)) {
      return true;
    }

    if (isOpen !== nextProps.isOpen) {
      return true;
    }

    return this.refresh;
  };

  render = () => {
    const { component, rowIndex, row, isOpen, validation } = this.props;

    if (isOpen) {
      return (
        <div>
          <div className={'edit-body ' + component.rowClass}>
            <RowEdit
              {...this.props}
            />
          </div>
        </div>
      );
    }
    else {
      const data = {
        row,
        rowIndex,
        components: component.components

      };
      const actions = [
        {
          class: 'removeRow',
          event: 'click',
          action: this.props.removeRow.bind(null, rowIndex)
        },
        {
          class: 'editRow',
          event: 'click',
          action: this.props.editRow.bind(null, rowIndex)
        }
      ];
      const Row = renderTemplate(component.templates.row, data, actions);
      return (
        <div>
          <Row />
          {
            validation && !validation.isValid ?
              <div className={validation.errorType + '-error'}>{validation.errorMessage}</div> :
              null
          }
        </div>
      );
    }
  }
}

class RowEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.row || {}
    };
  }

  componentDidMount = () => {
    this.props.onEvent('editGridOpen', this.props.rowIndex);
    this.unmounting = false;
  }

  componentWillUnmount = () => {
    this.props.onEvent('editGridClose', this.props.rowIndex);
    this.unmounting = true;
  }

  attachToForm = component => {
    this.inputs = this.inputs || {};
    this.inputs[component.props.component.key] = component;
  };

  detachFromForm = component => {
    if (this.unmounting) {
      return;
    }
    const { value } = this.state;
    if (!component.props.component.hasOwnProperty('clearOnHide') || component.props.component.clearOnHide !== false) {
      if (component.props.component.key && value && value.hasOwnProperty(component.props.component.key)) {
        this.setState(previousState => {
          delete previousState[component.props.component.key];
          return previousState;
        });
      }
    }
    delete this.inputs[component.props.component.key];
  };

  elementChange = component => {
    if (component.props.component.key) {
      this.setState(previousState => {
        let value = clone(previousState.value);
        value[component.props.component.key] = component.state.value;
        previousState.value = value;
        // If a component isn't pristine, the container isn't pristine.
        if (!component.state.isPristine && previousState.isPristine) {
          previousState.isPristine = false;
        }
        return previousState;
      });
    }
  };

  setPristine = isPristine => {
    // Mark all inputs as dirty so errors show.
    Object.keys(this.inputs).forEach(name => {
      this.inputs[name].setState({
        isPristine
      });
      if (typeof this.inputs[name].setPristine === 'function') {
        this.inputs[name].setPristine(isPristine);
      }
    });
    this.setState({
      isPristine
    });
  };

  editDone = () => {
    this.setPristine(false);

    // Check all inputs to make sure they are valid.
    let isValid = true;
    Object.keys(this.inputs).forEach(name => {
      if (!this.inputs[name].state.isValid) {
        isValid = false;
      }
    });

    if (isValid) {
      this.props.editDone(this.state.value, this.props.rowIndex);
    }
  }

  render = () => {
    const { component, rowIndex } = this.props;
    return (
      <div className="editgrid-edit">
        <div className="editgrid-body">
          <FormioComponentsList
            {...this.props}
            components={component.components}
            values={this.state.value}
            row={this.state.value}
            rowIndex={rowIndex}
            onChange={this.elementChange}
            attachToForm={this.attachToForm}
            detachFromForm={this.detachFromForm}
          />
          <div className="editgrid-actions">
            <div onClick={this.editDone} className="btn btn-primary btn-lg pull-right">{ component.saveRow || 'Save' }</div>
            { component.removeRow ?
              <div onClick={this.props.editDone.bind(null, null, rowIndex)} className="btn btn-danger btn-lg pull-right">{ component.removeRow || 'Cancel' }</div> :
              null
            }
          </div>
        </div>
      </div>
    );
  };
}

export default React.createClass({
  displayName: 'EditGrid',
  mixins: [valueMixin],
  getInitialValue: () => [],
  customState: function(state) {
    const { component } = this.props;
    let rows = state.value;
    if (component.validate && component.validate.hasOwnProperty('minLength') && rows.length < component.validate.minLength) {
      var toAdd = component.validate.minLength - rows.length;
      for (var i = 0; i < toAdd; i++) {
        rows.push({});
      }
    }
    // If more than maxLength, remove extra rows.
    if (component.validate && component.validate.hasOwnProperty('maxLength') && rows.length < component.validate.maxLength) {
      rows = rows.slice(0, component.validate.maxLength);
    }
    state.value = rows || [];
    state.openRows = [];
    state.rowsValid = [];
    return state;
  },
  setPristine: function(isPristine) {
    if (this.inputs) {
      this.inputs.forEach(row => {
        Object.keys(row).forEach(key => {
          row[key].setState({
            isPristine
          });
        });
      });
    }
  },
  getDefaultProps: function() {
    return {
      checkConditional: function() {
        return true;
      },
      isDisabled: function() {
        return false;
      }
    };
  },
  addRow: function() {
    if (this.props.readOnly) {
      return;
    }
    // Allow addRow override.
    const { component } = this.props;
    if (component.Edit) {
      return this.setState({
        openEdit: {
          id: null,
          row: {}
        },
      });
    }
    var rows = clone(this.state.value);
    const index = rows.length;
    this.props.onEvent('addEditgridRow', this);
    rows.push({});
    this.setState(previousState => {
      previousState.value = rows;
      previousState.isPristine = true;
      previousState.openRows.push(index);
      Object.assign(previousState, this.validateCustom(null, previousState));
      return previousState;
    }, () => {
      this.props.onChange(this);
    });
  },
  editRow: function(id) {
    this.setState(previousState => {
      previousState.openRows.push(id);
      Object.assign(previousState, this.validateCustom(null, previousState));
      return previousState;
    }, () => {
      this.props.onChange(this);
    });
  },
  editDone: function(row, id) {
    var value = clone(this.state.value);
    // If no id, this is an add.
    if (id === null && row) {
      this.props.onEvent('addEditgridRow', this);
      value.push(row);
    }
    else if (id !== null && row === null) {
      this.props.onEvent('removeEditgridRow', this, id);
      value.splice(id, 1);
    }
    else if (id !== null && row) {
      value[id] = row;
    }
    this.setState(previousState => {
      previousState.value = value;
      previousState.isPristine = false;
      previousState.openRows.splice(previousState.openRows.indexOf(id), 1);
      Object.assign(previousState, this.validateCustom(null, previousState));
      return previousState;
    }, () => {
      this.props.onChange(this);
    });
  },
  removeRow: function(id) {
    if (this.props.readOnly) {
      return;
    }
    var rows = clone(this.state.value);
    this.props.onEvent('removeEditgridRow', this, id);
    rows.splice(id, 1);
    this.setState(previousState => {
      previousState.value = rows;
      previousState.isPristine = false;
      Object.assign(previousState, this.validateCustom(null, previousState));
      return previousState;
    }, () => {
      this.props.onChange(this);
    });
  },
  validateCustom: function(value, state) {
    let isValid = true, errorType = '', errorMessage = '';
    const myState = state || this.state;
    if (myState) {
      if (myState.openRows.length) {
        isValid = false;
        errorType = 'editgrid';
        errorMessage = 'Please save all rows before proceeding.';
      }
      const rowsValid = this.validateRows(myState.value);
      if (!rowsValid.allRowsValid) {
        isValid = false;
        errorMessage = 'Please correct rows before proceeding.';
        errorType = 'editgrid-row';
      }
    }
    return {
      isValid,
      errorType,
      errorMessage
    };
  },
  validateRows: function(values) {
    const { component } = this.props;
    let allRowsValid = true;
    let rowsValid = values.map(value => {
      let state = {
        isValid: true,
        errorType: '',
        errorMessage: ''
      };
      let custom = component.validate.row;
      custom = custom.replace(/({{\s+(.*)\s+}})/, function(match, $1, $2) {
        return value[$2];
      }.bind(this));
      let valid;
      try {
        const row = value;
        const { data } = this.props;
        valid = eval(custom);
        state.isValid = (valid === true);
      }
      catch (e) {
        /* eslint-disable no-console, no-undef */
        console.warn('A syntax error occurred while computing custom values in ' + component.key, e);
        /* eslint-enable no-console */
      }
      if (!state.isValid) {
        state.errorType = 'custom';
        state.errorMessage = valid;
      }
      allRowsValid = allRowsValid && state.isValid;
      return state;
    });
    rowsValid.allRowsValid = allRowsValid;
    return rowsValid;
  },
  getElements: function() {
    const { value, openRows } = this.state;
    const rowsValid = this.validateRows(value);
    const { component, checkConditional } = this.props;
    const Header = renderTemplate(component.templates.header, {
      components: component.components,
      value
    });

    const Footer = renderTemplate(component.templates.footer, {
      components: component.components,
      value
    });

    let visibleCols = component.components.reduce((prev, col) => {
      prev[col.key] = value.reduce(
        (prev, row) => {
          return prev || checkConditional(col, row);
        }
        , false);
      return prev;
    }, {});

    let classLabel = 'control-label' + ( this.props.component.validate && component.validate.required ? ' field-required' : '');
    let inputLabel = (component.label && !component.hideLabel ? <label htmlFor={component.key} className={classLabel}>{component.label}</label> : '');

    var tableClasses = 'editgrid-listgroup list-group';
    tableClasses += (component.striped) ? ' table-striped' : '';
    tableClasses += (component.bordered) ? ' table-bordered' : '';
    tableClasses += (component.hover) ? ' table-hover' : '';
    tableClasses += (component.condensed) ? ' table-condensed' : '';
    let btnClassNames = 'btn btn-primary' + (this.props.readOnly ? ' disabled' : '');

    return (
      <div className='formio-edit-grid'>
        <label className={classLabel}>{inputLabel}</label>
        <ul className={tableClasses}>
          { component.templates.header ?
            <li className="list-group-item list-group-header">
              <Header />
            </li> : null
          }
          <li className="editgrid-rows list-group-item">
            {
              value.map((row, rowIndex) => {
                return (
                  <EditGridRow
                    {...this.props}
                    key={rowIndex}
                    component={component}
                    row={row}
                    rowIndex={rowIndex}
                    removeRow={this.removeRow}
                    editRow={this.editRow}
                    editDone={this.editDone}
                    isOpen={openRows.indexOf(rowIndex) !== -1}
                    validation={rowsValid[rowIndex]}
                  />
                );
              })
            }
          </li>
          { component.templates.footer ?
            <li className="list-group-item list-group-footer">
              <Footer />
            </li> : null
          }
        </ul>
        { (!component.hasOwnProperty('validate') || !component.validate.hasOwnProperty('maxLength') || value.length < component.validate.maxLength) ?
          <div className='editgrid-add'>
            <a onClick={this.addRow} className={btnClassNames}>
              <span><i className='glyphicon glyphicon-plus' aria-hidden='true'/> { component.addAnother || 'Add Another'}</span>
            </a>
          </div>
          : null
        }
      </div>
    );
  }
});
