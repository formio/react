import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormioUtils from 'formiojs/utils';
import _get from 'lodash/get';

export default class extends Component {
  static propTypes = {
    submissions: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    columnWidths: PropTypes.object.isRequired,
    onSort: PropTypes.func,
    onClick: PropTypes.func,
    Cell: PropTypes.func
  };

  static defaultProps = {
    onSort: () => {},
    onClick: () => {},
    Cell: props => {
      const {row, column} = props;
      return (
        <span>{_get(row, column.key, '')}</span>
      );
    }
  };

  render = () => {
    const {submissions, columns, columnWidths, sortOrder, onSort, onClick, Cell} = this.props;
    return (
      <div>
        { submissions.length ?
          <ul className='list-group list-group-striped'>
            <li className='list-group-item list-group-header hidden-xs hidden-md'>
              <div className='row'>
                { columns.map((column, index) => {
                  let sortClass = '';
                  if (sortOrder === column.key) {
                    sortClass = 'caret-invert';
                  }
                  else if (sortOrder === ('-' + column.key)) {
                    sortClass = 'caret';
                  }
                  return (
                    <div key={index} className={'col col-md-' + columnWidths[index]}
                         onClick={() => onSort(column.key)}>
                      <h4>{ column.title } <span className={sortClass}/></h4>
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
                          <h4 className='hidden-md hidden-lg'>{column.title}</h4>
                          <Cell row={submission} column={column} />
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul> :
          <div>No data found</div>
        }
      </div>
    );
  }
}
