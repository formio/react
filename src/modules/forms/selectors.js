import {selectRoot} from '../root/selectors';

export const selectForms = (name, state) => selectRoot(name, state).forms;
