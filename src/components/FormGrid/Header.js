import React from 'react';
import PropTypes from 'prop-types';

const GridHeaderForm = (props) => {
  return (
    <thead>
    <tr>
      <th>
        <div className="row">
          <div className="col-sm-8">
            <a onClick={props.onSort}>
              {props.header.label}
              {props.header.sort
                ? <i
                  className={'glyphicon fa glyphicon-triangle-top fa-caret-'.concat(props.header.sort === 'asc'
                    ? 'up'
                    : 'down')}
                />
                : null
              }
            </a>
          </div>
          <div className="col-sm-4">
            Operations
          </div>
        </div>
      </th>
    </tr>
    </thead>
  );
};

GridHeaderForm.propTypes = {
  header: PropTypes.object.isRequired,
  onSort: PropTypes.func
};

export default GridHeaderForm;
