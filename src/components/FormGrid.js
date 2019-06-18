import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _map from 'lodash/map';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: (props.forms && props.forms.pagination) ? props.forms.pagination.page : 0,
      query: props.query
    };
  }

  static propTypes = {
    forms: PropTypes.object.isRequired,
    perms: PropTypes.object,
    getForms: PropTypes.func,
    query: PropTypes.object,
    onAction: PropTypes.func,
    formAccess: PropTypes.func,
    columns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      sort: PropTypes.bool,
      width: PropTypes.number,
    })),
  }

  static defaultProps = {
    perms: {
      view: true,
      edit: true,
      data: true,
      delete: true
    },
    getForms: () => {},
    query: {
      sort: ''
    },
    formAccess: () => ({
      form: {
        create: true,
        view: true,
        edit: true,
        delete: true,
      },
      submission: {
        create: true,
        view: true,
        edit: true,
        delete: true,
      },
    }),
    columns: [
      {
        key: 'title',
        title: 'Form',
        sort: true,
        width: 8,
      },
      {
        key: 'operations',
        title: 'Operations',
        sort: false,
        width: 4,
      },
    ],
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

  onSort = (field) => {
    if (!this.state.query.sort) {
      this.setState(prevState => {
        prevState.query.sort = field;
        return prevState;
      }, () => this.props.getForms(this.state.page, this.state.query));
    }
    const currentSort = (this.state.query.sort && this.state.query.sort.length > 0 && this.state.query.sort[0] === '-')
      ? this.state.query.sort.slice(1, this.state.query.sort.length)
      : this.state.query.sort;
    if (currentSort !== field) {
      this.setState(prevState => {
        prevState.query.sort = field;
        return prevState;
      }, () => this.props.getForms(this.state.page, this.state.query));
    }
    else if (this.state.query.sort && this.state.query.sort.length > 0 && this.state.query.sort[0] !== '-') {
      this.setState(prevState => {
        prevState.query.sort = '-' + field;
        return prevState;
      }, () => this.props.getForms(this.state.page, this.state.query));
    }
    else {
      this.setState(prevState => {
        prevState.query.sort = '';
        return prevState;
      }, () => this.props.getForms(this.state.page, this.state.query));
    }
  };

  stopPropagationWrapper = (fn) => (event) => {
    event.stopPropagation();
    fn();
  }

  Cell = props => {
    const {row: form, column, formAccess} = props;

    const access = formAccess(form);

    if (column.key === 'title') {
      return (
        <span style={{cursor: 'pointer'}} onClick={this.stopPropagationWrapper(() => {
          if (access.submission.create) {
            props.onAction(form, 'view');
          }
        })}><h5>{form.title}</h5></span>
      );
    }
    else if (column.key === 'operations') {
      return (
        <div>
          {access.submission.create
            ? <span className="btn btn-primary btn-sm form-btn" onClick={this.stopPropagationWrapper(() => props.onAction(form, 'view'))}>
              <i className="fa fa-pencil" />&nbsp;
              Enter Data
            </span>
            : null
          }
          {access.submission.view
            ? <span className="btn btn-warning btn-sm form-btn" onClick={this.stopPropagationWrapper(() => props.onAction(form, 'submission'))}>
              <i className="fa fa-list-alt" />&nbsp;
              View Data
            </span>
            : null
          }
          {access.form.edit
            ? <span className="btn btn-secondary btn-sm form-btn" onClick={this.stopPropagationWrapper(() => props.onAction(form, 'edit'))}>
              <i className="fa fa-edit" />&nbsp;
              Edit Form
            </span>
            : null
          }
          {access.form.delete
            ? <span className="btn btn-danger btn-sm form-btn" onClick={this.stopPropagationWrapper(() => props.onAction(form, 'delete'))}>
              <i className="fa fa-trash" />
            </span>
            : null
          }
        </div>
      );
    }
    else {
      return (
        <span>{_isFunction(column.value) ? column.value(form) : _get(form, column.value, '')}</span>
      );
    }
  };

  render() {
    const {forms: {forms, limit, pagination}, onAction, formAccess, perms, columns} = this.props;
    const columnWidths = _map(columns, 'width');
    const skip = (parseInt(this.state.page) - 1) * parseInt(limit);
    const last = skip + parseInt(limit) > pagination.total ? pagination.total : skip + parseInt(limit);
    const sortOrder = this.state.query.sort;

    return (
      <Grid
        items={forms}
        columns={columns}
        columnWidths={columnWidths}
        onAction={onAction}
        onSort={this.onSort}
        onPage={this.onPage}
        sortOrder={sortOrder}
        activePage={pagination.page}
        firstItem={skip + 1}
        lastItem={last}
        total={parseInt(pagination.total)}
        pages={Math.ceil(parseInt(pagination.total) / limit)}
        emptyText="No forms found"
        Cell={this.Cell}
        formAccess={formAccess}
        perms={perms}
      />
    );
  }
}
