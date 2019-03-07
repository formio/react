export const selectRoot = (name, state) => state[name];
export const selectError = (name, state) => selectRoot(name, state).error;
