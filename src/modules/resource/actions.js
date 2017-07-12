import {formActions} from '../form/actions';
import {submissionActions} from '../submission/actions';

export default function(resource) {
  return {
    form: formActions(resource),
    submission: submissionActions(resource)
  };
}
