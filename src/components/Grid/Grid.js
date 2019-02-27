import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormioUtils from 'formiojs/utils';
import _get from 'lodash/get';
import {Pagination} from 'react-bootstrap';

import * as styles from '../styles/managerGrid.css';

export default class extends Component {
  static propTypes = {
    submissions: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    columnWidths: PropTypes.object.isRequired,
    createNewLabel: PropTypes.string,
    onCreateNew: PropTypes.func,
    onSort: PropTypes.func,
    onClick: PropTypes.func,
    onPage: PropTypes.func,
    firstItem: PropTypes.number,
    lastItem: PropTypes.number,
    total: PropTypes.number,
    pages: PropTypes.number,
    activePage: PropTypes.number,
    Cell: PropTypes.func
  };

  static defaultProps = {
    onSort: () => {},
    onClick: () => {},
    onPage: () => {},
    firstItem: 1,
    lastItem: 1,
    total: 1,
    pages: 1,
    activePage: 1,
    Cell: props => {
      const {row, column} = props;
      return (
        <span>{_get(row, column.key, '')}</span>
      );
    }
  };

  render = () => {
    const {submissions, columns, columnWidths, sortOrder, onSort, onClick, Cell} = this.props;
    const {firstItem, lastItem, total, activePage, onPage, pages} = this.props;
    return (
      <div>
        { submissions.length ?
          <ul className={'list-group list-group-striped ' + styles.peps}>
            <li className='list-group-item list-group-header hidden-xs hidden-md'>
              <div className='row'>
                { columns.map((column, index) => {
                  let sortClass = '';
                  if (sortOrder === column.key) {
                    sortClass = 'glyphicon glyphicon-triangle-top';
                  }
                  else if (sortOrder === ('-' + column.key)) {
                    sortClass = 'glyphicon glyphicon-triangle-bottom';
                  }
                  return (
                    <div key={index} className={'col col-md-' + columnWidths[index]}>
                      <a onClick={() => onSort(column.key)}><strong>{ column.title } <span className={sortClass}/></strong></a>
                    </div>
                  );
                })}
              </div>
            </li>
            { submissions.map((submission, index) => {
              return (
                <li className='list-group-item' key={submission._id}>
                  <div className='row'>
                    { columns.map((column, index) => {
                      return (
                        <div key={index} className={'col col-md-' + columnWidths[index]} onClick={() => onClick(submission)}>
                          <h4 className='d-none'>{column.title}</h4>
                          <Cell row={submission} column={column} />
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
            <li className="list-group-item">
              {this.props.createNewLabel
                ? <button
                    onClick={this.props.onCreateNew}
                    className="btn btn-primary pull-left float-left"
                  >
                    {this.props.createNewLabel}
                  </button>
                : null
              }
              <Pagination
                className="pagination-sm"
                prev="Previous"
                next="Next"
                items={pages}
                activePage={activePage}
                maxButtons={5}
                onSelect={onPage}
              />
              <span className="pull-right item-counter"><span className="page-num">{ firstItem } - { lastItem }</span> / { total } total</span>
            </li>
          </ul> :
          <div>No data found</div>
        }
      </div>
    );
  }
}
