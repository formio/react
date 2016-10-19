import React from 'react';
import { Formio, FormioView } from '../../components';

export default function (resource) {
  return class extends FormioView {
    container = ({ src, form, submission, params }) => {
      if (form.isFetching || !form.form || submission.isFetching || !submission.submission || params[resource.name + 'Id'] !== submission.submission._id) {
        return (
          <div className="form-view">
            Loading...
          </div>
        );
      }
      else {
        return (
          <div className="form-view">
            <Formio
              src={src}
              form={form.form}
              submission={submission.submission}
              readOnly={true}
            />
          </div>
        );
      }
    }

    terminate = () => {
      console.log('terminate');
    }

    mapStateToProps = ({ formio }, { params }) => {
      return {
        src: formio[resource.name].form.src + '/submission/' + params[resource.name + 'Id'],
        form: formio[resource.name].form,
        submission: formio[resource.name].submission,
      };
    }

    mapDispatchToProps = null
  };
}
