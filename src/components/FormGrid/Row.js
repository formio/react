import React from 'react';
import PropTypes from 'prop-types';

const GridFooterForm = (props) => {
  return (
    <tbody>
    {props.items.map( form => {
      return (
        <tr key={form._id}>
          <td>
            <div className="row">
              <div className="col-sm-8">
                <a href="#" onClick={props.onRowSelect}><h5>{form.title}</h5></a>
              </div>
              <div className="col-sm-4">
                {props.body.isFormViewAllowed
                  ? <button className="btn btn-secondary btn-sm form-btn" onClick={() => props.onRowAction(form, 'view')}>
                    <i className="fa fa-pencil" />
                    Enter Data
                  </button>
                  : null
                }
                {props.body.isSubmissionIndexAllowed
                  ? <button className="btn btn-secondary btn-sm form-btn" onClick={() => props.onRowAction(form, 'submission')}>
                    <i className="fa fa-list-alt" />
                    View Data
                  </button>
                  : null
                }
                {props.body.isFormEditAllowed
                  ? <button className="btn btn-secondary btn-sm form-btn" onClick={() => props.onRowAction(form, 'edit')}>
                    <i className="fa fa-edit" />
                    Edit Form
                  </button>
                  : null
                }
                {props.body.isFormDeleteAllowed
                  ? <button className="btn btn-secondary btn-sm form-btn" onClick={() => props.onRowAction(form, 'delete')}>
                    <i className="fa fa-trash" />
                  </button>
                  : null
                }
              </div>
            </div>
          </td>
        </tr>
      );
    })}
    </tbody>
  );
};

GridFooterForm.propTypes = {
  body: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  onRowSelect: PropTypes.func.isRequired,
  onRowAction: PropTypes.func.isRequired,
};

export default GridFooterForm;
