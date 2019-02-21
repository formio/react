import {combineReducers} from 'redux';
import {formReducer, formsReducer} from '../form/reducers';
import {submissionReducer, submissionsReducer} from '../submission/reducers';

export default function(config) {
  return combineReducers({
    form: formReducer(config),
    forms: formsReducer(config),
    submission: submissionReducer(config),
    submissions: submissionsReducer(config)
  });
}
