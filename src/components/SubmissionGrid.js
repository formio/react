import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormioUtils from 'formiojs/utils';
import {Components} from 'formiojs';
import _get from 'lodash/get';
import Grid from './Grid';

export default class extends Component {
  static propTypes = {
    submissions: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    query: PropTypes.object,
    onAction: PropTypes.func,
    getSubmissions: PropTypes.func,
  };

  static defaultProps = {
    onRowClick: () => {}
  }

  getColumns = () => {
    let columns = [];
    FormioUtils.eachComponent(this.props.form.components, function(component) {
      if (component.input && component.tableView && component.key) {
        columns.push({
          key: 'data.' + component.key,
          title: component.label || component.title || component.key,
          sort: '',
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

  render = () => {
    const {submissions, onAction, onSort, onPage, page, limit, sortOrder} = this.props;
    const columns = this.getColumns();
    const columnWidths = this.calculateWidths(columns.length);

    return (
      <Grid
        items={submissions}
        columns={columns}
        columnWidths={columnWidths}
        onSort={onSort}
        onAction={onAction}
        onPage={onPage}
        sortOrder={sortOrder}
        activePage={page + 1}
        firstItem={parseInt(submissions.skip) + 1}
        lastItem={parseInt(submissions.skip) + parseInt(submissions.limit)}
        total={parseInt(submissions.serverCount)}
        pages={Math.ceil(submissions.serverCount / limit)}
        emptyText='No data found'
        Cell={this.Cell}
      />
    );
  };
}
