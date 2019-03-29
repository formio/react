import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import Pagination from './Pagination';

export default class extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    columnWidths: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    onAction: PropTypes.func,
    onPage: PropTypes.func,
    firstItem: PropTypes.number,
    lastItem: PropTypes.number,
    total: PropTypes.number,
    pages: PropTypes.number,
    activePage: PropTypes.number,
    emptyText: PropTypes.string,
    Cell: PropTypes.func
  };

  static defaultProps = {
    onSort: () => { },
    onAction: () => { },
    onPage: () => { },
    firstItem: 1,
    lastItem: 1,
    total: 1,
    pages: 1,
    activePage: 1,
    emptyText: 'No data found',
    Cell: props => {
      const {row, column} = props;
      return (
        <span>{_get(row, column.key, '')}</span>
      );
    }
  };

  render = () => {
    const {items, columns, columnWidths, sortOrder, onSort, emptyText, Cell, perms} = this.props;
    const {firstItem, lastItem, total, activePage, onPage, pages, pageNeighbours} = this.props;

    if (items.length && columns.length > 12) {
      return (<div>
        <div style={{maxWidth: '100%', overflowX: 'scroll'}}>
          <table className="table">
            <thead>
              <tr>
                {columns.map((column, index) => {
                  if (!column.sort) {
                    return (
                      <td key={index} style={index === columns.length - 1 ? {position:  'sticky', right: 0, background: 'white'} : {}} >
                        <strong>{column.title}</strong>
                      </td>
                    );
                  }
                  let sortClass = '';
                  if (sortOrder === column.key) {
                    sortClass = 'glyphicon glyphicon-triangle-top fa fa-caret-u';
                  }
                  else if (sortOrder === ('-' + column.key)) {
                    sortClass = 'glyphicon glyphicon-triangle-top fa fa-caret-up';
                  }

                  return (
                    <td
                      key={index}
                      style={index === columns.length - 1 ? {position:  'sticky', right: 0, cursor: 'pointer', background: 'white'} : {}}
                    >
                      <span
                        style={{cursor: 'pointer'}}
                        onClick={() => onSort(column.key)}
                      >
                        <strong>{column.title} <span className={sortClass} /></strong>
                      </span>
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} onClick={() => this.props.onAction(item, 'row')}>
                  {columns.map((column, index) => {
                    return (
                      <td key={index} style={{position: index === columns.length - 1 ? 'sticky' : 'inherit', right: 0, background: 'white'}}>
                        <Cell row={item} column={column} {...this.props} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <span className="pull-left">
          <Pagination
            pages={pages}
            activePage={activePage}
            pageNeighbours={pageNeighbours}
            prev="Previous"
            next="Next"
            onSelect={onPage}
          />
        </span>
        <span className="pull-right item-counter"><span className="page-num">{firstItem} - {lastItem}</span> / {total} total</span>
      </div>);
    }

    if (items.length) {
      return (<div>
        <ul className='list-group list-group-striped'>
          <li className='list-group-item list-group-header hidden-xs hidden-md'>
            <div className='row'>
              {columns.map((column, index) => {
                if (!column.sort) {
                  return (
                    <div key={index} className={'col col-md-' + columnWidths[index]}>
                      <strong>{column.title}</strong>
                    </div>
                  );
                }
                let sortClass = '';
                if (sortOrder === column.key) {
                  sortClass = 'glyphicon glyphicon-triangle-top fa fa-caret-up';
                }
                else if (sortOrder === ('-' + column.key)) {
                  sortClass = 'glyphicon glyphicon-triangle-bottom fa fa-caret-down';
                }
                return (
                  <div
                    key={index}
                    className={'col col-md-' + columnWidths[index]}
                    style={{cursor: 'pointer'}}
                  >
                    <span
                      style={{cursor: 'pointer'}}
                      onClick={() => onSort(column.key)}
                    >
                      <strong>{column.title} <span className={sortClass} /></strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </li>
          {items.map((item, index) => {
            return (
              <li className='list-group-item' key={item._id}>
                <div className='row' onClick={() => this.props.onAction(item, 'row')}>
                  {columns.map((column, index) => {
                    return (
                      <div key={index} className={'col col-md-' + columnWidths[index]}>
                        <Cell row={item} column={column} {...this.props} />
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
          <li className="list-group-item">
            <span className="pull-left">
              <Pagination
                pages={pages}
                activePage={activePage}
                pageNeighbours={pageNeighbours}
                prev="Previous"
                next="Next"
                onSelect={onPage}
              />
            </span>
            <span className="pull-right item-counter"><span className="page-num">{firstItem} - {lastItem}</span> / {total} total</span>
          </li>
        </ul>
      </div>);
    }

    return (<div>{emptyText}</div>);
  }
}
