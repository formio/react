import React from 'react';
import ReduxView from 'redux-view';
import { Link } from 'react-router';
import { FormActions } from '../../actions';

export default function (builder) {
  return class extends ReduxView {
    container = ({ loading, forms }) => {
      if (loading) {
        return <div className="formio-builder">
          <span className="glyphicon glyphicon-refresh glyphicon-spin" style={{fontSize: '2em'}}></span> Loading
        </div>;
      }
      return (
        <div className="formio-builder">
          <Link to={builder.options.base + '/forms/create'} className="btn btn-primary">
            <span className="glyphicon glyphicon-plus"></span> Create Form
          </Link>
          <table className="table table-striped" style={{marginTop: '20px'}}>
            <tbody>
            {forms.map((form, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="row">
                      <div className="col-sm-8">
                        <Link to={builder.options.base + '/form/' + form._id + ''}><h5>{ form.title }</h5></Link>
                      </div>
                      <div className="col-sm-4">
                        <div className="button-group pull-right" style={{display:'flex'}}>
                          <Link to={builder.options.base + '/form/' + form._id} className="btn btn-default btn-xs">
                            <span className="glyphicon glyphicon-pencil"></span> Enter Data
                          </Link>&nbsp;
                          <Link to={builder.options.base + '/form/' + form._id + '/submission'} className="btn btn-default btn-xs">
                            <span className="glyphicon glyphicon-list-alt"></span> View Data
                          </Link>&nbsp;
                          <Link to={builder.options.base + '/form/' + form._id + '/edit'} className="btn btn-default btn-xs">
                            <span className="glyphicon glyphicon-edit"></span> Edit Form
                          </Link>&nbsp;
                          <Link to={builder.options.base + '/form/' + form._id + '/delete'} className="btn btn-default btn-xs">
                            <span className="glyphicon glyphicon-trash"></span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )
    }

    initialize = ({ dispatch }) => {
      dispatch(FormActions.index(builder.key, builder.options.tag));
    }

    mapStateToProps = ({ formio }) => {
      return {
        loading: formio[builder.key].forms.isFetching,
        forms: formio[builder.key].forms.forms
      };
    }
  };
}
