import React from 'react';
import FormioView from '../../../FormioView';

export default config => class Delete extends FormioView {
  component = props => {
    return (
      <div>
        <h3>Are you sure you wish to delete this record?</h3>
        <div className="btn-toolbar">
          <span onClick={props.onYes} className="btn btn-danger">Yes</span>
          <span onClick={props.onNo} className="btn btn-default">No</span>
        </div>
      </div>
    );
  }

  mapDispatchToProps = (dispatch, ownProps) => {
    return {
      onYes: () => {
        dispatch(this.formio.resources[config.name].actions.submission.delete(ownProps.params[config.name + 'Id']));
        this.router.push('/' + config.name);
      },
      onNo: this.router.goBack
    };
  }
};
