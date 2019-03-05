import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: props.pagination.page,
      query: props.query
    };
  }

  static propTypes = {
    forms: PropTypes.object,
    perms: PropTypes.object,
    getForms: PropTypes.func,
    onAction: PropTypes.func
  }

  static defaultProps = {
    perms: {
      view: true,
      edit: true,
      data: true,
      delete: true
    },
    pagination: {
      page: 1,
      numPages: 1,
      total: 1
    },
    getForms: () => {},
    query: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.query !== prevState.query) {
      return {
        query: nextProps.query
      };
    }

    return null;
  }

  onPage = (page) => {
    this.setState(prevState => {
      prevState.page = page;
      return prevState;
    }, () => this.props.getForms(this.state.page, this.state.query));
  };

  getColumns() {
    return [
      {
        key: 'title',
        title: 'Form',
        sort: false
      },
      {
        key: 'operations',
        title: 'Operations',
        sort: false
      }
    ];
  }

  Cell = props => {
    const {row: form, column} = props;

    if (column.key === 'title') {
      return (
        <a href="#" onClick={() => props.onAction(form, 'view')}><h5>{form.title}</h5></a>
      );
    }
    else {
      return (
        <div>
          {props.perms.view
            ? <span className="btn btn-primary btn-sm form-btn" onClick={() => props.onAction(form, 'view')}>
              <i className="fa fa-pencil" />&nbsp;
              Enter Data
            </span>
            : null
          }
          {props.perms.data
            ? <span className="btn btn-warning btn-sm form-btn" onClick={() => props.onAction(form, 'submission')}>
              <i className="fa fa-list-alt" />&nbsp;
              View Data
            </span>
            : null
          }
          {props.perms.edit
            ? <span className="btn btn-secondary btn-sm form-btn" onClick={() => props.onAction(form, 'edit')}>
              <i className="fa fa-edit" />&nbsp;
              Edit Form
            </span>
            : null
          }
          {props.perms.delete
            ? <span className="btn btn-danger btn-sm form-btn" onClick={() => props.onAction(form, 'delete')}>
              <i className="fa fa-trash" />
            </span>
            : null
          }
        </div>
      );
    }
  }

  render() {
    const {forms: {forms, limit, pagination}, onAction, perms} = this.props;
    const columns = this.getColumns();
    const columnWidths = {0: 8, 1: 4};
    const skip = (parseInt(this.state.page) - 1) * parseInt(limit);
    const last = skip + parseInt(limit) > pagination.total ? pagination.total : skip + parseInt(limit);

    return (
      <Grid
        items={forms}
        columns={columns}
        columnWidths={columnWidths}
        onAction={onAction}
        onPage={this.onPage}
        activePage={pagination.page}
        firstItem={skip + 1}
        lastItem={last}
        total={parseInt(pagination.total)}
        pages={Math.ceil(parseInt(pagination.total) / limit)}
        emptyText="No forms found"
        Cell={this.Cell}
        perms={perms}
      />
    );
  }
}
