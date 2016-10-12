import { combineReducers } from 'redux';

let reducers = {};

export function addReducer(name, reducer) {
  if (reducer) {
    reducers = {
      ...reducers,
      [name]: reducer
    };
  }
}

export function formioReducers() {
  return combineReducers({ ...reducers });
}
