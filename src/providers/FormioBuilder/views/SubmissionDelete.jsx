import React from 'react';
import ReduxView from 'redux-view';
import { FormioConfirm } from '../../components';
import { SubmissionActions } from '../../actions';

export default function (builder) {
  return class extends ReduxView {
    container = ({ title, onYes, onNo }) => {
      return (
        <div className="form-delete">
          <FormioConfirm
            message={'Are you sure you wish to delete the ' + title + '?'}
            buttons={[
              {
                text: 'Yes',
                class: 'btn btn-danger',
                callback: onYes
              },
              {
                text: 'No',
                class: 'btn btn-default',
                callback: onNo
              }
            ]}
          />
        </div>
      );
    }

    mapStateToProps = ({ formio }) => {
      return {
        title: formio[builder.key].form.form.title
      };
    }

    mapDispatchToProps = (dispatch, { params }, router) => {
      return {
        onYes: () => {
          SubmissionActions.delete(builder.key, params['submissionId'], params[builder.key + 'Id'])
            .then(() => {
              router.transitionTo(builder.options.base);
            })
            .catch((error) => {

            })
        },
        onNo: () => {
          router.transitionTo(builder.options.base);
        }
      };
    }
  };
}
