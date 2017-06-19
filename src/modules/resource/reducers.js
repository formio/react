import {combineReducers} from 'redux';
import {formReducer} from '../form/reducers';
import {submissionReducer, submissionsReducer} from '../submission/reducers';

export default function(config) {
  return combineReducers({
    form: formReducer(config),
    submission: submissionReducer(config),
    submissions: submissionsReducer(config)
  });
}