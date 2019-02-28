import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import FormioUtils from 'formiojs/utils';
import Components from 'formiojs/components';
import _get from 'lodash/get';

import Grid from '../../../components/Grid/Grid';

export default class extends Component {
  static propTypes = {
    forms: PropTypes.array.isRequired,
    createNewLabel: PropTypes.string,
    onRowClick: PropTypes.func,
    onCreateNew: PropTypes.func
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
      return <a href="#"><h5>{cellValue}</h5></a>;
    }
    return (
      <Fragment>
        <button className="btn btn-secondary btn-sm form-btn">
          <i className="fa fa-pencil" />
          {'Enter Data'}
        </button>
        <button className="btn btn-secondary btn-sm form-btn">
          <i className="fa fa-list-alt" />
          {'View Data'}
        </button>
        <button className="btn btn-secondary btn-sm form-btn">
          <i className="fa fa-edit" />
          {'Edit Form'}
        </button>
        <button className="btn btn-secondary btn-sm form-btn">
          <i className="fa fa-trash" />
        </button>
      </Fragment>
    );
  };

  render = () => {
    const {forms, onRowClick, onSort, onPage, page, limit, sortOrder} = this.props;
    const columns = this.getColumns();
    const columnWidths = this.calculateWidths(columns.length);
    const createNewLabel = this.props.createNewLabel;
    const onCreateNew = this.props.onCreateNew;

    return (
      <Grid
        items={forms}
        columns={columns}
        columnWidths={columnWidths}
        createNewLabel={createNewLabel}
        onSort={onSort}
        onClick={onRowClick}
        onPage={onPage}
        onCreateNew={onCreateNew}
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
