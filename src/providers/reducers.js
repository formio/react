import {combineReducers} from 'redux';
import formReducer from '../reducers/form';
import submissionReducer from '../reducers/submission';
import submissionsReducer from '../reducers/submissions';

let reducers = {};

export function injectReducers(name, src) {
  reducers = {
    ...reducers,
    [name]: combineReducers({
      form: formReducer(name, src),
      submission: submissionReducer(name, src),
      submissions: submissionsReducer(name, src),
    })
  };
}

export function formioReducers() {
  return combineReducers({...reducers});
}
