import {combineReducers} from 'redux';
import formReducer from './form';
import submissionReducer from './submission';
import submissionsReducer from './submissions';

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
  return {...reducers};
}
