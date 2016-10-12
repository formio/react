import React from 'react';
import Formiojs from 'formiojs';
import FormioUtils from 'formio-utils';
import {
  Table, search, edit, sort, highlight, resolve,
  SearchColumns, resizableColumn
} from 'reactabular';
import Paginator from './Paginator';
import { nested } from '../util';
import { FormioComponents } from '../factories';

export default class extends React.Component {
  static defaultProps = {
    form: {},
    submissions: [],
    query: {
      sort: '-created'
    },
    pagination: {
      page: 1,
      numPages: 1,
      sizes: [25, 50, 75],
      size: 25
    },
    buttons: [],
    buttonLocation: 'right'
  }

  static propTypes = {
    src: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      columns: this.columnsFromForm(props.form),
      submissions: this.props.submissions || [],
      pagination: this.props.pagination
    };
  };

  formatCell = (value, {column}) => {
    return FormioComponents.getComponent(column.component.type).prototype.getDisplay(column.component, value);
  }

  columnsFromForm = (form) => {
    let columns = [];
    let buttons = this.props.buttons.map((button) => {
      return {
        property: '_id',
        header: {
          label: button.label
        },
        cell: {
          format: (rowKey, {rowData}) => {
            return (
              <a className={button.class} onClick={(event) => {this.onButtonClick(event, button.event, rowData)}}>
                {(() => {
                  if (button.icon) {
                    return <i className={button.icon} aria-hidden="true"></i>;
                  }
                })()}
                <span>{button.label}</span>
              </a>
            )
          }
        },
        visible: true
      }
    });
    if (form && form.components) {
      FormioUtils.eachComponent(form.components, (component, path) => {
        if (component.input && component.tableView && component.key && path.indexOf('.') === -1) {
          columns.push({
            component: component,
            property: 'data.' + component.key,
            header: {
              label: component.label || component.key,
              props: {
                style: {
                  width: 100
                }
              }
            },
            cell: {
              format: this.formatCell
            },
            visible: true
          });
        }
      });
    }
    if (!buttons.length) {
      return columns;
    }
    if (this.props.buttonLocation === 'right') {
      return columns.concat(buttons);
    }
    else {
      return buttons.concat(columns);
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.form !== this.props.form) {
      this.setState({
        columns: this.columnsFromForm(nextProps.form)
      });
    }
    if (nextProps.submissions !== this.state.submissions) {
      this.setState({
        submissions: nextProps.submissions
      });
    }
    if (nextProps.pagination.page !== this.state.pagination.page) {
      this.setState({
        pagination: {
          page: nextProps.pagination.page
        }
      });
    }
    if (nextProps.pagination.numPage !== this.state.pagination.numPage) {
      this.setState({
        pagination: {
          numPage: nextProps.pagination.numPage
        }
      });
    }
    if (nextProps.pagination.size !== this.state.pagination.size) {
      this.setState({
        pagination: {
          size: nextProps.pagination.size
        }
      });
    }
  };

  componentDidMount = () => {
    if (this.props.src) {
      this.formio = new Formiojs(this.props.src);
      this.loadForm();
      this.loadSubmissions();
    }
  };

  loadForm = () => {
    this.formio.loadForm().then(form => {
      this.setState({
        columns: this.columnsFromForm(form)
      });
    });
  }

  loadSubmissions = () => {
    this.formio.loadSubmissions({
      params: {
        ...this.props.query,
        limit: this.state.pagination.size,
        skip: (this.state.pagination.page - 1) * this.state.pagination.size
      }
    }).then(submissions => {
      this.setState({
        submissions,
        pagination: {
          numPages: Math.ceil(submissions.serverCount / this.state.pagination.size)
        }
      })
    });
  }

  onButtonClick = (event, type, row) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof this.props.onButtonClick === 'function') {
      this.props.onButtonClick(type, row._id);
    }
  }

  onRowClick = (row) => {
    return {
      onClick: () => {
        if (typeof this.props.onButtonClick === 'function') {
          this.props.onButtonClick('row', row._id);
        }
      }
    };
  }

  onPageChange = (page) => {
    if (typeof this.props.onPageChange === 'function') {
      this.props.onPageChange(page);
    }
    else {
      this.setState({
        pagination: {
          page: page
        }
      }, this.loadSubmissions);
    }
  }

  render = () => {
    let rows = resolve.resolve({
      columns: this.state.columns,
      method: nested
    })(this.state.submissions);
    return (
      <div className="table-responsive">
        <Table.Provider
          className="table table-striped table-bordered table-hover"
          columns={this.state.columns}
        >
          <Table.Header>
            {/*<SearchColumns query={query} columns={columns} onChange={onSearch} />*/}
          </Table.Header>
          <Table.Body
            rows={rows}
            rowKey="_id"
            onRow={this.onRowClick}
          />
        </Table.Provider>

        <div className="controls">
          <Paginator
             pagination={this.state.pagination}
             onSelect={this.onPageChange}
           />
         </div>
      </div>
    );
  }
}
