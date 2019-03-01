import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Pagination} from 'react-bootstrap';

const GridFooterForm = (props) => {
  return (
    <tfoot className="formio-grid-footer">
    <tr>
      {props.footer.numHeaders
        ? <td colSpan={props.footer.numHeaders}>
          {props.footer.isCreateAllowed
            ? (<Fragment>
              <button className="btn btn-primary pull-left float-left" onClick={props.onCreateNew}>
                <i className="glyphicon glyphicon-plus fa fa-plus" />
                {props.footer.createText ? props.footer.createText : 'Create New'}
              </button>
              <Pagination
                className="justify-content-center pagination-sm"
                prev="Previous"
                next="Next"
                items={props.total}
                activePage={props.activePage}
                maxButtons={5}
                onSelect={props.onPage}
              />
              <span className="pull-right float-right item-counter">
                      <span className="page-num">{props.firstItem } - {props.lastItem}</span> / {props.total} total
                    </span>
            </Fragment>)
            : null
          }
        </td>
        : null
      }
    </tr>
    </tfoot>
  );
};

GridFooterForm.propTypes = {
  footer: PropTypes.object.isRequired,
  activePage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  firstItem: PropTypes.number.isRequired,
  lastItem: PropTypes.number.isRequired,
  onPage: PropTypes.func.isRequired
};

export default GridFooterForm;
