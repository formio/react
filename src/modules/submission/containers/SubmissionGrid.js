import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormioUtils from 'formiojs/utils';
import Components from 'formiojs/build/components';
import _get from 'lodash/get';
import Grid from '../../../components/Grid';

export default class extends Component {
  static propTypes = {
    submissions: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    onRowClick: PropTypes.func
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

  toggleSort = (field) => {
    let {sortOrder} = this.props;
    if (sortOrder === field) {
      sortOrder = '-' + field;
    }
    else {
      sortOrder = field;
    }
  };

  Cell = props => {
    const {row, column} = props;
    let cellValue = _get(row, column.key);
    const getMarkup = value => ({__html: column.component.asString(value)});
    if (cellValue) {
      // TODO: If this is a simple string we shouldn't set innerHTML but currently no way to know.
      return <div dangerouslySetInnerHTML={getMarkup(cellValue)} />;
    }
    else {
      return null;
    }
  }

  render = () => {
    const {submissions, onRowClick} = this.props;
    const columns = this.getColumns();
    const columnWidths = this.calculateWidths(columns.length);

    return (
      <Grid
        submissions={submissions}
        columns={columns}
        columnWidths={columnWidths}
        onSort={() => {}}
        onClick={onRowClick}
        Cell={this.Cell}
      />
    );
  };
}
