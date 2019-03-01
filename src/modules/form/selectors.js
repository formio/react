import {selectRoot} from '../root/selectors';

export const selectForm = (name, state) => selectRoot(name, state).form;
