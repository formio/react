import {selectRoot} from '../root/selectors';

export const selectSubmissions = (name, state) => selectRoot(name, state).submissions;
