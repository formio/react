import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormioUtils from 'formiojs/utils';
import Components from 'formiojs/components';
import _get from 'lodash/get';

import Grid from '../../../components/Grid';
import NavLink from 'react-router-dom/es/NavLink';

export default class extends Component {
  static propTypes = {
    forms: PropTypes.array.isRequired,
    onRowClick: PropTypes.func
  };

  static defaultProps = {
    onRowClick: () => {}
  }

  getColumns = () => {
    const columns = [
      {
        key: 'title',
        title: 'Title',
        sort: ''
      },
      {
        key: 'created',
        title: 'Operations',
        sort: ''
      },
    ];
    return columns.slice(0, 2);
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
    const cellValue = row[column.key];

    if (cellValue === null) {
      return null;
    }
    if (column.key === 'title') {
      return <NavLink to={'/' + row._id + '/view'}><h5>{cellValue}</h5></NavLink>;
    }
    return <span>{cellValue}</span>;
  };

  render = () => {
    const {forms, onRowClick, onSort, onPage, page, limit, sortOrder} = this.props;
    const columns = this.getColumns();
    const columnWidths = this.calculateWidths(columns.length);

    return (
      <Grid
        submissions={forms}
        columns={columns}
        columnWidths={columnWidths}
        onSort={onSort}
        onClick={onRowClick}
        onPage={onPage}
        sortOrder={sortOrder}
        activePage={page}
        firstItem={parseInt(forms.skip) + 1}
        lastItem={parseInt(forms.skip) + parseInt(forms.limit)}
        total={parseInt(forms.serverCount)}
        pages={Math.ceil(forms.serverCount / limit)}
        Cell={this.Cell}
      />
    );
  };
}
