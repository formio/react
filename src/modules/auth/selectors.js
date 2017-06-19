export default function(authConfig) {
  const getRoot = state => authConfig.rootSelector(state);
  const getAuth = state => getRoot(state)[authConfig.storeKey];
  const getUser = state => getAuth(state).user;
  const getAuthenticated = state => getAuth(state).authenticated;

  return {
    getAuth,
    getUser,
    getAuthenticated
  };
}
