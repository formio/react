import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormioUtils from 'formiojs/utils';
import {Components} from 'formiojs';
import _get from 'lodash/get';
import Grid from './Grid';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: props.pagination ? props.pagination.page : 0,
      query: props.query
    };
  }

  static propTypes = {
    submissions: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    query: PropTypes.object,
    onAction: PropTypes.func,
    getSubmissions: PropTypes.func,
  };

  static defaultProps = {
    query: {},
    onAction: () => {},
    getSubmissions: () => {},
  };

  getColumns = () => {
    let columns = [];
    FormioUtils.eachComponent(this.props.form.components, function(component) {
      if (component.input && component.tableView && component.key) {
        columns.push({
          key: 'data.' + component.key,
          title: component.label || component.title || component.key,
          sort: true,
          component: Components.create(component, null, null, true)
        });
      }
    });
    return columns.slice(0, 12);
  };

  calculateWidths = (columns) => {
    let result = {};
    let left = 12;
    var basewidth = Math.floor(12/columns);
    for (let i = 0; i < columns; i++) {
      result[i] = basewidth;
      left -= basewidth;
    }
    for (var i = 0; i < left; i++) {
      result[i]++;
    }
    return result;
  };

  Cell = props => {
    const {row, column} = props;
    const cellValue = _get(row, column.key);

    if (cellValue === null) {
      return null;
    }
    const rendered = column.component.asString(cellValue);
    if (cellValue !== rendered) {
      return <div dangerouslySetInnerHTML={{__html: rendered}} />;
    }
    else {
      return <span>{cellValue}</span>;
    }
  }

  onPage = (page) => {
    this.setState(prevState => {
      prevState.page = page;
      return prevState;
    }, () => this.props.getSubmissions(this.state.page, this.state.query));
  };

  onSort = (field) => {
    if (!this.state.query.sort) {
      this.setState(prevState => {
        prevState.query.sort = field;
        return prevState;
      }, () => this.props.getSubmissions(this.state.page, this.state.query));
    }
    const currentSort = (this.state.query.sort && this.state.query.sort.length > 0 && this.state.query.sort[0] === '-')
      ? this.state.query.sort.slice(1, this.state.query.sort.length)
      : this.state.query.sort;
    if (currentSort !== field) {
      this.setState(prevState => {
        prevState.query.sort = field;
        return prevState;
      }, () => this.props.getSubmissions(this.state.page, this.state.query));
    }
    else if (this.state.query.sort && this.state.query.sort.length > 0 && this.state.query.sort[0] !== '-') {
      this.setState(prevState => {
        prevState.query.sort = '-' + field;
        return prevState;
      }, () => this.props.getSubmissions(this.state.page, this.state.query));
    }
    else {
      this.setState(prevState => {
        prevState.query.sort = '';
        return prevState;
      }, () => this.props.getSubmissions(this.state.page, this.state.query));
    }
  };

  render = () => {
    const {submissions: {submissions, limit, pagination}, onAction} = this.props;
    const columns = this.getColumns();
    const columnWidths = this.calculateWidths(columns.length);
    const skip = (parseInt(this.state.page) - 1) * parseInt(limit);
    const last = skip + parseInt(limit) > pagination.total ? pagination.total : skip + parseInt(limit);
    const sortOrder = this.state.query.sort;

    return (
      <Grid
        items={submissions}
        columns={columns}
        columnWidths={columnWidths}
        onSort={this.onSort}
        onPage={this.onPage}
        onAction={onAction}
        sortOrder={sortOrder}
        activePage={pagination.page}
        firstItem={skip + 1}
        lastItem={last}
        total={parseInt(pagination.total)}
        pages={Math.ceil(parseInt(pagination.total) / limit)}
        emptyText='No data found'
        Cell={this.Cell}
      />
    );
  };
}
